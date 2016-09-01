import xs from 'xstream';
import isolate from '@cycle/isolate'
import {div, input, span} from '@cycle/dom';


function LabeledSlider(sources) {
	const domSource = sources.DOM;
	const props$ = sources.props;

	const newValue$ = domSource.select('.slider').events('input')
		.map( e => e.target.value);

	const state$ = props$
		.map( props => newValue$
			.map( val => ({
				label: props.label,
				unit: props.unit,
				min: props.min,
				value: val,
				max: props.max
			}))
		.startWith(props) 
		)
		.flatten()
		.remember();


	const vdom$ = state$
		.map(state => 
			div('.labeled-slider', [
				span('.label', state.label + ' ' + state.value + state.unit),
				input('.slider', {attrs: {type: 'range', min: state.min, max: state.max, value: state.value} })
			])
		);

	const sinks = {
		DOM: vdom$,
		value: state$.map( state => state.value)
	}

	return sinks;
}

export default sources => isolate(LabeledSlider)(sources)