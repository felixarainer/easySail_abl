/* @flow */

import React, { Component } from 'react';
import { View, Text, Image, AppRegistry, StyleSheet } from 'react-native';
import FlagItem from './FlagItem';

export default class FlagView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<View style={{ flex: 3 }}>
				<Image
					source={require('../res/pics/ship.png')}
					style={styles.backgroundImage}
				>
					<View style={[styles.flagRow, { marginTop: '13.1%' }]}>
						<FlagItem
							style={{ marginLeft: '12%' }}
							flag={this.props.flags.flag1}
						/>
						<FlagItem
							style={{ marginLeft: '19%' }}
							flag={this.props.flags.flag2}
						/>
					</View>
					<View style={[styles.flagRow, { marginTop: '7.7%' }]}>
						<FlagItem
							style={{ marginLeft: '19.4%' }}
							flag={this.props.flags.flag3}
						/>
						<FlagItem
							style={{ marginLeft: '19%' }}
							flag={this.props.flags.flag4}
						/>
					</View>
				</Image>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	flagRow: {
		flex: 0.25,
		flexDirection: 'row',
	},
	backgroundImage: {
		flex: 1,
		height: undefined,
		width: undefined,
		resizeMode: 'cover',
	},
});

AppRegistry.registerComponent('FlagView', () => FlagView);
