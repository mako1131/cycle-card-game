import xs from 'xstream';
import {div,input} from '@cycle/dom';
import isolate from '@cycle/isolate';


function UserBoard(sources) {

	const props = sources.props;
	const clickEvents$ = sources.DOM.select(`#user_${props.userID} .action`).events('click').startWith({target:{dataset:[]}})
	const state$ = sources.state;


	const action$ = clickEvents$
		.map( evt => ({action: evt.target.dataset['action'] , user: props.userID }) )

	
	const vTree$ = xs.combine(clickEvents$, state$)
		// .map( ([ev,props,state]) => {console.log([ev,props,state]); return [ev,props,state]} )
		.map( ([ev, state]) => {
			const isActiveUser = state.activePlayerID == props.userID;

			return(
			div(`#user_${props.userID}`, {attrs: {style:'width: 40%; display:inline-block;'}},[
				div(`user ${props.userID}`),
				input('.endTurn.action',{attrs:{type: 'button', value: 'endTurn', "data-action": 'endTurn', "data-userid":userID, disabled: !isActiveUser}}),
				input('.playCard1.action',{attrs:{type: 'button', value: 'playCard1', "data-action": 'playCard1', disabled: !isActiveUser}}),
				input('.playCard2.action',{attrs:{type: 'button', value: 'playCard2', "data-action": 'playCard2', disabled: !isActiveUser}}),
				input('.drawCard.action',{attrs:{type: 'button', value: 'drawCard', "data-action": 'drawCard', disabled: !isActiveUser}}),
			])
		)})

	const sinks = {
		DOM: vTree$,
		action: action$
	};

  return sinks;
}

function log(arg) { console.log(arg); return arg }

export default UserBoard
//export default sources => isolate(UserBoard)(sources);
