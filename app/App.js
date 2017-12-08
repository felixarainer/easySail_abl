import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ActionView from './components/ActionView';
import FlagView from './components/FlagView';
import Orientation from 'react-native-orientation-locker';

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			flags: {
				flag1: {
					name: '1hs',
					pic: require('./res/pics/flags/1hs.png'),
					ratio: 1.57,
				},
				flag2: {
					name: 'black',
					pic: require('./res/pics/flags/black.png'),
					ratio: 1,
				},
				flag3: {
					name: 'p',
					pic: require('./res/pics/flags/p.png'),
					ratio: 1,
				},
				flag4: {
					name: 'x',
					pic: require('./res/pics/flags/x.png'),
					ratio: 1,
				},
			},
		};
	}

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	onCountdownFinished = () => {
		this.setState(previousState => {
			console.log(previousState.flags.flag1.name);
			return {
				flags: {
					flag1: {
						name: 'black',
						pic: require('./res/pics/flags/black.png'),
						ratio: 1,
					},
					flag2: {
						name: '1hs',
						pic: require('./res/pics/flags/1hs.png'),
						ratio: 1.57,
					},
				},
			};
		});
	};

	render() {
		return (
			<View style={styles.container}>
				<FlagView flags={this.state.flags} />
				<ActionView
					onFinished={() => {
						console.log('countdown finished');
						//this.onCountdownFinished();
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		//alignItems: "center",
		//justifyContent: "center",
	},
});
