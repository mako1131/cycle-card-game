//helper functions *********************
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

const inputActions = [
	'DRAW_CARD',
	'PLAY_CARD',
	'PICK_COLOR',

	'END_TURN',
	'CONCEDE',
]

	
//game **************************
function createGame() {

	const state = [{
		status: 'not_started', //turn, over, preparing, 
		timestamp: Date.now().toString(),
		turn: 0,
		play: ,
		activeUserID: '',
		deck: [],
		stack: [],
		playerHand: {},
		players: [] //[{userID: 123, name: 'anonymous', type: 'player'}, ...],	
	]}

	const turnActions = [];

	const retObj = {};

	//deck functions
	generateDeck =  () => 
		cartesian(
			['hearts', 'spades', 'clubs', 'diamonds'], 
			['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
		).map( cardArr => ({ color: cardArr[0], value: cardArr[1] }) ),
			

	addJokers = (deck, num) => 
		deck.concat( Array.from({length: 5}, () => ({color: '', value: 'joker'})) ),

	shuffle = deck => {
		let deck = deck.splice(0), m = deck.length;
		while (m) {
			const i = Math.floor( Math.random() * m--)
			[deck[m], deck[i]] = [deck[i], deck[m]]
		}
		return deck;
	}
	//state functions
	getWholeState = () => state

	getState = () => state[ state.length - 1]

	rememberState = newState => {state.push(newState); return newState}

	//card functions
	getStackCard = () => state.stack [state.stack.length - 1]

	getPlayerHand = (userID) => state.playerHand.filter( playerStruct => playerStruct.key === userID)

	drawCard = (userID, number) => {
		const currState = getState();
		const newState = Object.assign({}, currState);
		newState.playerHand[userID].push( currState.deck.splice(-1) );
		return rememberState(newState);
	}

	playCard = (userID, index) => {
		const currState = getState();
		const newState = Object.assign({}, currState);
		newState.stock.push( newState.playerHand[userID].splice(index, 1)[0] );
		return rememberState(newState);
	}

	assignColor = (color) => {
		const currState = getState();
		const newState = Object.assign({}, currState);
		newState.stock[ newState.stock.length ]['assignedColor'] = color;
		return rememberState(newState); 
	}

	setNextActivePlayer = () => {
		const currState = getState();
		const activeUserIndex = currState.players.findIndex( user => user.userID === currState.activeUserID );
		
		activeUserIndex = activeUserIndex % currState.userIDs.length;

		const newState = Object.assign({}, currState, {
			activeUserID: currState.users[activeUserIndex]
		});

		return rememberState(newState);
	}
}


const gameLogic = (state, userAction) => { //list of available actions for player
	//check ci hra je aktivna
	const 	userID = userAction.params.userID || state.activeUserID,
			actionType = userAction.type,
			gameStatus = state.status,
			playerHand = status.playerHand,
			userIDs = state.players.map( userStruct => userStruct.UserID);

	if(gameStatus === 'end') return [];


	//check ci som na rade
	if( userAction.params.userID !== state.activeUserID ) return [];

	//check akcie


		// ak akcia zahranie karty 
			// mozem zahrat kartu

		//ak akcia 

	switch(actionType){
		case 'END_TURN': 
			setNextActivePlayer();
			



			break;



	}
}