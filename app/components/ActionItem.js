/* @flow */

import React, { Component } from 'react';
import { AppRegistry, View, Text, Image, StyleSheet } from 'react-native';

export default class ActionItem extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Image
					source={this.props.item.pic}
					style={{ width: 193, height: 110 }}
				/>
				<Text>Key: {this.props.item.name}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'grey',
	},
});

AppRegistry.registerComponent('ActionItem', () => ActionItem);
