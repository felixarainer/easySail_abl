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

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			curFlags: {},
		};
		this.step = 0; //TODO(Reder): ordentlich implementieren (ggf. redux, keine ahnung wie gscheider)
	}

	componentWillMount = () => {
		this.setInitialFlags();
	};

	setInitialFlags = () => {
		this.setState({
			curFlags: {
				flag1: res.flags.x,
				flag2: res.flags.x,
				flag3: res.flags.x,
				flag4: res.flags.x,
			},
			countdownEndDate: moment().add(5, 'seconds'),
			//nextFlags:
		});
	};

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		//code to determine next state (flags, actions, ...) goes here
		switch (this.step) {
			case 0:
				this.setState({
					curFlags: {
						flag1: {},
						flag2: res.flags.x,
						flag3: {},
						flag4: {},
					},
					countdownEndDate: moment().add(1, 'minute'),
				});
				this.step = 1;
				break;
			case 1:
				this.setState({
					curFlags: {
						flag1: {},
						flag2: res.flags.p,
						flag3: res.flags.z,
						flag4: {},
					},
					countdownEndDate: moment().add(1, 'minute'),
				});
				this.step = 2;
				break;
			case 2:
				this.setState({
					curFlags: {
						flag1: {},
						flag2: res.flags.z,
						flag3: {},
						flag4: {},
					},
					countdownEndDate: moment().add(5, 'seconds'),
					//nextFlags:
				});
				this.step = 3;
			default:
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
