/* @flow */

import React, { Component } from 'react';
import { View, Text, Image, AppRegistry, StyleSheet } from 'react-native';
import FlagItem from './FlagItem';

export default class FlagView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flag1: {
				name: 'returnflag',
				pic: require('../res/pics/flags/1hs.png'),
			},
			flag2: {
				name: 'startflag',
				pic: require('../res/pics/flags/black.png'),
			},
			flag3: {
				name: '',
				pic: {},
			},
			flag4: {
				name: 'returnflag',
				pic: require('../res/pics/flags/p.png'),
			},
		};
	}

	render() {
		return (
			<View style={{ flex: 3 }}>
				<Image
					source={require('../res/pics/ship.png')}
					style={styles.backgroundImage}
				>
					<View style={styles.flagRow1}>
						<FlagItem flag={this.state.flag1} />
						<FlagItem flag={this.state.flag2} />
						{/*
							<FlagItem
								style={styles.flagContainerStyle}
								flag={this.state.flag2}
							/>
							<FlagItem
								style={styles.flagContainerStyle}
								flag={this.state.flag3}
							/>
							<FlagItem
								style={styles.flagContainerStyle}
								flag={this.state.flag4}
							/>*/}
					</View>
				</Image>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	flagRow1: {
		flex: 0.25,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		//marginTop: '13%',
		//marginLeft: '12%',
	},
	backgroundImage: {
		flex: 1,
		height: undefined,
		width: undefined,
		resizeMode: 'cover',
	},
});

AppRegistry.registerComponent('FlagView', () => FlagView);
