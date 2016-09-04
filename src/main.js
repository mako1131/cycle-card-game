import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, input, p, h2, span} from '@cycle/dom';
// import isolate from '@cycle/isolate';
import Game from './game.js'
import UserDOM from './components/UserDOM'


function main(sources) {

	const players = [{id:'1', name: 'mako'}, {id:'2', name: 'pewdiepie'}];
	
	const game = Game(players);
	game.startGame();

	//process action
	const action$ = sources.DOM.select('[data-action]').events('click')
		.map( e => e.target.dataset)
		.startWith({})

	//put action to game
	const availableActions$ = game.manageTurn(action$)

	//game produces new state internally and return available actions for each player + their hands
	//const userDoms$ = availableActions$.map( action => getUserDOM(action) )

	//test
	const vDOMsArray = players.map(p => UserDOM(p.id, availableActions$[p.id]))
	//

	//map available actions to each user -> render DOM
	const vDOM$ = xs.combine( ...vDOMsArray )
		.map( userDoms => div("#container", userDoms) )



	const sinks = {
		DOM: vDOM$
	}

	return sinks;
}


const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
