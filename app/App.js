// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions (TODO) / Count-
// 	down to children as props i.e. sets next state for the whole app ('Regelsys-
//	tem')
//:
// TODO: migrate Countdown logic here
// ?TODO?: Redux

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ActionView from './components/ActionView';
import FlagView from './components/FlagView';
import Orientation from 'react-native-orientation-locker';
import * as res from './res/res.js';
import moment from 'moment';

class actState{
	constructor(flags,actions,time){
		this.flags = flags;
		this.actions = actions;
		this.time = time;
	}

	getState = ()=>{
		return {
			curFlags: {
				flag1: this.flags[0],
				flag2: this.flags[1],
				flag3: this.flags[2],
				flag4: this.flags[3],
			},
			curActions: this.actions,
			countdownEndDate: typeof(this.time) === 'number' ? moment().add(this.time, 'seconds') : this.time,
		}
	}
}

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			curFlags: {},
		};
		this.step = 0; //TODO(Reder): ordentlich implementieren (ggf. redux, keine ahnung wie gscheider)
	}

	componentWillMount() {
		this.actlist = this.createStartStates(
			[
				{time: moment('8:42','HH:mm'),
				 condition: 'z' },

		]);
		this.setInitialFlags();
		console.log('length of actlist after creating:' + this.actlist.length);
	}

	//TODO: felix fragen, array wird nicht erzeugt => undefined
	createStartStates = (args) => {
		starttime = moment(args[0].time).subtract(6,'minutes');
		let action1 = [
			//flagge l setzen und 6 min vor Start bergen
			new actState(
				[res.flags.l,{},{},{}],
				[{
					name: 'TestAction2',
					actionPic: res.actions.flag_down,
					flagPic: res.flags.l,
				}],
				starttime
		)];

		let ac = []

		args.forEach(start => {

			//2te aktion
			//l ist geborgen und in einer minute ankündigungssignal + Klassenflagge
			ac.push(new actState(
					[{},{},{},{}],
					[{
						name: 'TestAction1',
						actionPic: res.actions.signal_1,
						flagPic: undefined,
					},
					{
						name: 'TestAction2',
						actionPic: res.actions.flag_up,
						flagPic: res.flags.klass,
					}],
					moment(starttime).add(1,'m')
			))

			ac.push(
				//3te aktion
				//Klassenflagge gesetzt
				//in einer minute Vorbereitungssignal und Startmethode
					new actState(
							[res.flags.klass,{},{},{}],
							[{
								name: 'TestAction1',
								actionPic: res.actions.signal_1,
								flagPic: undefined,
							},
							{
								name: 'TestAction2',
								actionPic: res.actions.flag_up,
								//TODO damir fragen wegen res.flags.{start.condition}
								flagPic: res.flags[start.condition],
							}],
							moment(starttime).add(2,'m')
				))

				ac.push(//4te aktion
				//Condition Flagge gesetzt
				//3 minuten bis zum 1 min signal
				new actState(
						[res.flags.klass,res.flags[start.condition],{},{}],
						[{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_down,
							//TODO damir fragen wegen res.flags.{start.condition}
							flagPic: res.flags[start.condition],
						}],
						moment(starttime).add(5,'m')
				))

				ac.push(//5te aktion
				//1 minuten signal geschossen, condition flagge geborgen
				//1 minute bis start
				new actState(
						[res.flags.klass,{},{},{}],
						[{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_down,
							//TODO damir fragen wegen res.flags.{start.condition}
							flagPic: res.flags.klass,
						}],
						moment(starttime).add(6,'m')
				))
		})

		console.log(ac)
		return action1.concat(ac)
	}

	////onstart()
	// componentWillMount = () => {
	// 	this.setInitialFlags();
	// };

	setInitialFlags = () => {
		this.setState(this.actlist[0].getState());
		console.log(this.actlist.length);
	};


	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		console.log('updateFlags')
		if(this.step<=this.actlist.length){
			this.step++;
			this.setState(this.actlist[this.step].getState());
		}
	};

	render = () => {
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					backgroundColor: '#fff',
				}}
			>
				<FlagView flags={this.state.curFlags} />
				<ActionView
					actions={this.state.curActions}
					countdownEndDate={this.state.countdownEndDate}
					onFinished={() => {
						console.log('App.render.onFinished()');
						this.updateFlags();
					}}
				/>
			</View>
		);
	};
}
