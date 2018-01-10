// ActionItem - Used by ActionView to display an action Object as an Image
//
// TODO: remove width / height; set up to use static image

import React, { Component } from 'react';
import { AppRegistry, View, Text, Image, StyleSheet } from 'react-native';

import * as res from '../res/res.js';

export default class ActionItem extends Component {
	render() {
		return (
			<View style={styles.container}>
				{this.props.item.flagPic === undefined ? (
					<Image
						source={this.props.item.actionPic}
						style={{ flex: 1, height: undefined, width: undefined }}
					/>
				) : (
					<View style={{ flexDirection: 'row', flex: 1 }}>
						<Image
							source={this.props.item.actionPic}
							style={{ flex: 0.3, height: undefined, width: undefined }}
						/>
						<Image
							source={this.props.item.flagPic}
							style={
								{
									//flex: 1,
									//height: undefined,
									//width: undefined,
									//resizeMode: 'contain',
								}
							}
						/>
					</View>
				)}
				<Text
					style={{ fontWeight: 'bold', fontSize: 18, justifyContent: 'center' }}
				>
					{this.props.item.name}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'lightgrey', // TODO remove
		height: '35%',
		width: '95%',
	},
});

AppRegistry.registerComponent('ActionItem', () => ActionItem);
