const Game = function(players){

	const state = [{
		status: 'not_started', //turn, over, preparing, 
		action: 'default_state',
		timestamp: Date.now().toString(),
		turn: 0,
		activeUserID: players[0].id,
		deck: [],
		stack: [],
		playerHand: players.reduce((all,player)=>{all[player.id]=[]; return all}, {}),
		players: players 
	}]

	const getWholeState = () => state

	const getState = () => state[ state.length - 1]

	const cloneState = (action) =>  Object.assign({}, state[ state.length - 1], action ? {action} : {});

	const rememberState = newState => {state.push(newState); return newState}



	//deck functions -----------------------------------------------------------------
	const generateDeck = () => 
		cartesian(
			['hearts', 'spades', 'clubs', 'diamonds'], 
			['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
	).map( cardArr => ({ color: cardArr[0], value: cardArr[1] }) )


	const shuffle = deck => {
		let m = deck.length
	 	deck = deck.splice(0)
		while (m) {
			const i = Math.floor( Math.random() * m--)
			[deck[m], deck[i]] = [deck[i], deck[m]]
		}
		return deck;
	}

	const addJokers = (deck, num=6) => 
		deck.concat( Array.from({length: 5}, () => ({color: '', value: 'joker'})) )


	const drawCard = (userID) => {
		const newState = cloneState('draw_card');
		const drawnCard = currState.deck.splice(-1);
		newState.playerHand[userID].push( drawnCard );
		rememberState(newState);
		return drawnCard;
	}


	const deal = (num = 5) => {
		const newState = cloneState();
		newState.players.forEach( player =>
			Array.from({length:num}, v=>0).forEach( () => 
				newState.playerHand[player.id].push( newState.deck.splice(-1) )
			)			
		)
	}

	const manageTurn = (dataset$) => dataset$
		.map(dataset => {
			if(dataset.action === 'start_game') 
				return handleStartGame(dataset)
			if(dataset.action === 'end_turn') 
				return handleEndTurn(dataset)
			return availableActions();
		})

	const availableActions = state => {
		const newState = state || getState()
		return newState.players
		.map( player => {
			if(player.id == newState.activeUserID) 
				return {
					user: player,
					actions: [{action:'end_turn'}],
					turn: newState.turn
				}
			return {
				user: player,
				actions: [],
				turn: newState.turn
			}
		})		
	}
	
	const handleStartGame = (dataset$) => {
		const newState = cloneState('start_game');
		newState.turn++;
		rememberState(newState);

		return availableActions(newState)
	}
	

	const handleEndTurn = (dataset$) => {
		const newState = cloneState();
		newState.turn++;
		// //set next active player
		const activeUserIndex = newState.players.findIndex( user => user.id === newState.activeUserID );
		newState.activeUserID = newState.players[activeUserIndex+1 > (newState.players.length -1) ? 0 : activeUserIndex+1].id;

		rememberState(newState)

		return availableActions(newState)
	}


	const startGame = () => {
		generateDeck();
		deal();
	}

	//... 

	return {
		startGame,
		manageTurn,
	}
}

export default Game
// helper functions ----------------------------------------------
function cartesian() {
	return Array.prototype.reduce.call(arguments, function(a, b) {
		var ret = [];
		a.forEach(function(a) {
			b.forEach(function(b) {
				ret.push(a.concat([b]));
			});
		});
		return ret;
	}, [[]]);
}
function log(arg) { console.log(arg); return arg }

