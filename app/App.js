// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions (TODO) / Count-
// 	down to children as props i.e. sets next state for the whole app ('Regelsys-
//	tem')
//
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
			countdownEndDate: moment().add(this.time, 'seconds'),
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
		this.actlist =[
			//1ste aktion
			new actState(
					[res.flags.x,res.flags.x,res.flags.x,res.flags.x],
					[{
						name: 'TestAction1',
						actionPic: res.actions.signal_2,
						flagPic: undefined,
					},
					{
						name: 'TestAction2',
						actionPic: res.actions.flag_down,
						flagPic: res.flags.z,
					}],
					5
					),
		//2te aktion------------------------------------------
		new actState(
				[res.flags.z,res.flags.x,res.flags.z,res.flags.x],
				[{
					name: 'TestAction1',
					actionPic: res.actions.signal_2,
					flagPic: undefined,
				},
				{
					name: 'TestAction2',
					actionPic: res.actions.flag_down,
					flagPic: res.flags.z,
				}],
				33
				),
		];
	}

	//onstart()
	componentWillMount = () => {
		this.setInitialFlags();
	};

	setInitialFlags = () => {
		this.setState(this.actlist[0].getState());
	};


	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		this.step++;
		this.setState(this.actlist[this.step].getState());
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
