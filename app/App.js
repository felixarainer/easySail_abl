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
		console.log(res.flags.black);
	}
	setInitialFlags = () => {
		this.setState({
			curFlags: {
				flag1: res.flags._1hs,
				flag2: res.flags.black,
				flag3: res.flags.p,
				flag4: res.flags.x,
			},
			countdownEndDate: moment().add(5, 'seconds'),
			//nextFlags:
		});
	};

	componentWillMount = () => {
		this.setInitialFlags();
	};

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		//code to determine next state (flags, actions, ...) goes here
		this.setState({
			curFlags: {
				flag1: res.flags.x,
				flag2: res.flags.p,
				flag3: {},
				flag4: res.flags.black,
			},
			countdownEndDate: moment().add(10, 'seconds'),
		});
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
