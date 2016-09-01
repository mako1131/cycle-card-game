import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, input, p, h2, span} from '@cycle/dom';
import isolate from '@cycle/isolate';
// import LabeledSlider from './components/LabeledSlider' 
import UserBoard from './components/UserBoard'







const game = {
	handleTakeFromPile: (stateOrig, action) => {
		const [actionType, userID] = [action.type, action.params.userID];
		const state = Object.assign({}, stateOrig)    
		console.log('handling',userID, actionType)
		return {state, action};


	},
	handleEndTurn: (stateOrig, action) => {
		const [actionType, userID] = [action.type, action.params.userID];
		const state = Object.assign({}, stateOrig)    
		console.log('handling',userID, actionType)
		return {state, action};
	}
}




function main(sources) {

	//transform events from DOM to user actions -----------------------------
	const clickEvents$ = sources.DOM.select('document').events('click').filter(evt => evt.target.dataset.action)
	const userID$ = xs.of( 1 );

	const state$ = xs.of({
		 activePlayerID: 1,
		 gameState: 'turn'
	});

	const userActions$ = xs.combine(clickEvents$, userID$, state$)
		.map( ([evt, userID, state]) => ({state, action: {type: evt.target.dataset.action, params:{userID: userID}} }))


	//game logic -> produces new game state -------------------------------
	const processedUserActions$ = userActions$
		.map(log)
		.map( ({state, action}) => {
			switch(action.type){
				case 'drawCard': return game.handleTakeFromPile(state, action)
				case 'endTurn': return game.handleEndTurn(state, action)
				default: return {state, action}
			}
		})

	const user1props = {
	   userID: '1'
	};
	 const user2props = {
	   userID: '2'
	};


	const user1 = isolate(UserBoard)({DOM: sources.DOM, props: user1props, state:state$});
	const user2 = isolate(UserBoard)({DOM: sources.DOM, props: user2props, state:state$});

	//const action$ = xs.combine(user1.action, user2.action)

	const user1VDom$ = user1.DOM;
	const user2VDom$ = user2.DOM;

	const combined$ = xs.combine( user1VDom$, user2VDom$)

	const vDOM$ = combined$ 
		// .map( log )
		.map( ([user1vdom, user2vdom]) => (
			div([
				user1vdom,
				user2vdom
			])
		))



	//output - changes vdom depending on game state ------------------------------
	// const vDOM$ = processedUserActions$
	// 	// .map( log )
	// 	.startWith({})
	// 	.map( ({state, action}) => ( 
	// 		div([
	// 			'test',
	// 			user1VDom$,
	// 			user2VDom$,
	// 			input('.endTurn',{attrs:{type: 'button', value: 'endTurn', "data-action": 'endTurn', disabled: true}}),
	// 			input('.playCard1',{attrs:{type: 'button', value: 'playCard1', "data-action": 'playCard1'}}),
	// 			input('.playCard2',{attrs:{type: 'button', value: 'playCard2', "data-action": 'playCard2'}}),
	// 			input('.drawCard',{attrs:{type: 'button', value: 'drawCard', "data-action": 'drawCard'}}),
	// 		])
	// 	))


	const sinks = {
		DOM: vDOM$
	}

	return sinks;
}


const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);

//helper functions 
function log(arg) { console.log(arg); return arg }


const cardColors = ['hearts', 'spades', 'clubs', 'diamonds'];
const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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

function shuffle(arr) {
  var array = arr.splice(0);
  var m = array.length, i;

  while (m) {// While there remain elements to shuffle…

    i = Math.floor(Math.random() * m--); // Pick a remaining element…
    [array[m], array[i]] = [array[i], array[m]]  // And swap it with the current element.
  }

  return array;
}

const generateDeck = (cardColors, cardValues) => 
	cartesian(cardColors, cardValues).map( cardArr => ({ color: cardArr[0], value: cardArr[1] }) )

const addJokers = (deck, num) => deck.concat( Array.from({length: 5}, () => ({color: '', value: 'joker'})) )

// console.log(
// 	shuffle(addJokers(generateDeck(cardColors, cardValues)))
// )



const gamestate = {
	state: 'turn/over/loading?',
	playerTurn: 123,
	turns: [ 
		[ { deck: [], stack: [], playerHand: {123: [], 333: []} } ]
	],
	players: [{userID: 123, name: 'anonymous'}, {userID: 333, name: 'anonymous'}]	
}



