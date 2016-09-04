import xs from 'xstream';
import {div,input} from '@cycle/dom';
import isolate from '@cycle/isolate';


function UserDOM(userID, aAction$) {
	console.log(userID)
	const vTree$ = aAction$
		.map( aAction => {
			const endTurnAvailable = aAction.filter( a => a.action == 'end_turn').length > 0;
			return(
				div(`#user_${props.userID}`, {attrs: {style:'width: 40%; display:inline-block;'}},[
					div(`user ${userID}`),
					div(`Turn:${aAction.filter(a=>a.turn).map(a=>a.turn)}`),
					input('.endTurn.action',{
						attrs:{
							type: 'button', 
							value: 'endTurn', 
							"data-action": 'endTurn', 
							"data-userid": userID, 
							disabled: endTurnAvailable
						}
					}),
					input('.playCard1.action',{attrs:{type: 'button', value: 'playCard1', "data-action": 'playCard1', disabled: !isActiveUser}}),
					input('.playCard2.action',{attrs:{type: 'button', value: 'playCard2', "data-action": 'playCard2', disabled: !isActiveUser}}),
					input('.drawCard.action',{attrs:{type: 'button', value: 'drawCard', "data-action": 'drawCard', disabled: !isActiveUser}}),
				])
		)})

	const sinks = {
		DOM: vTree$
	};

  return sinks;
}

function log(arg) { console.log(arg); return arg }

export default UserDOM
//export default sources => isolate(UserDOM)(sources);
