import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, input, p, h2, span, br, hr} from '@cycle/dom';
// import isolate from '@cycle/isolate';
import Game from './game.js'
import UserDOM from './components/UserDOM'


function main(sources) {

	const players = [
		{id:'11', name: 'mako'}, 
		{id:'22', name: 'pewdiepie'},
		{id:'33', name: 'tama'},
		{id:'44', name: 'pexo'}
	];
	
	const game = Game(players);
	game.startGame();

	//process action
	const action$ = sources.DOM.select('.action').events('click')
		.map( e => e.target.dataset)
		.startWith({action:'start_game'})


	//put action to game
	const availableActions$ = game.manageTurn(action$)
	const vDOMS$ = availableActions$.map(actions => 
		actions.map(userAction => (
			div('#userID_${userAction.user.name}',[
				`User: ${userAction.user.name}`,
				br(),
				`Turn: ${userAction.turn}`,
				br(),
				input('.endTurn.action',{
					attrs:{
						type: 'button', 
						value: 'endTurn', 
						"data-action": 'end_turn',
						disabled: userAction.actions.filter( x => x.action =='end_turn').length == 0
					}
				}),
				input('.drawCard.action',
					{attrs:{
						type: 'button', 
						value: 'drawCard', 
						"data-action": 'drawCard',
						disabled: userAction.actions.filter( x=>x.action =='draw_card').length == 0
					}
				}),
				br(),
				hr()
			])	
		))
	);
	
	const vDOMsArray = vDOMS$
		//.map(x => {console.log(x); return x})
		.map(x=>{console.log(x); return x})
		.startWith([{},{}])
		.map( vdoms => (
			div('#container', [
				div('#playerContainer', vdoms)
			])
			
		))

	const sinks = {
		DOM: vDOMsArray
	}

	return sinks;
}


const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
