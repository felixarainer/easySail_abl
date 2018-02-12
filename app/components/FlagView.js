// FlagView - Displays current Flags
//
//		Left part of the screen. Displays a stylized dinghy with masts as
//		background with the currently set flags on top.
//
//		Flag Positions are currently hardcoded
//
//		TODO: add fullscreen mode e.g. make ActionView toggleable
//

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
					<View
						style={[
							styles.flagRow,
							{
								marginTop: '13.1%',
								marginLeft: '12.3%',
								marginRight: '25.6%',
							},
						]}
					>
						<FlagItem flag={this.props.flags.flag1} />
						<FlagItem flag={this.props.flags.flag2} />
					</View>
					<View
						style={[
							styles.flagRow,
							{
								marginTop: '7.7%',
								marginLeft: '19.4%',
								marginRight: '18.45%',
							},
						]}
					>
						<FlagItem flag={this.props.flags.flag3} />
						<FlagItem flag={this.props.flags.flag4} />
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
		justifyContent: 'space-between',
	},
	backgroundImage: {
		flex: 1,
		height: undefined,
		width: undefined,
		resizeMode: 'cover',
	},
});

AppRegistry.registerComponent('FlagView', () => FlagView);
