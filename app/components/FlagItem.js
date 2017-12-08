/* @flow */

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
//import LeftAlignedImage from 'react-native-left-aligned-image';

export default class FlagItem extends Component {
	render() {
		return (
			<View style={styles.flagContainer}>
				<Image
					style={this.state.imageSize || styles.initialImageStyle}
					source={this.props.flag.pic}
					onLayout={this.onLayout.bind(this)}
				/>
				{/*<Text>{this.props.flag.name}</Text>*/}
			</View>
		);
	}
}

onLayout = e => {
	if (this.state.imageSize) {
		return;
	}

	const { x, y, height, width } = e.nativeEvent.layout,
		sizeX = width - x,
		sizeY = height - y,
		imageWidth = sizeX / sizeY * IMAGE_HEIGHT;

	this.setState({
		imageSize: {
			height: IMAGE_HEIGHT,
			width: imageWidth,
			resizeMode: 'contain',
		},
	});
};

const styles = StyleSheet.create({
	initialImageStyle: { flex: 1, resizeMode: 'cover' },
	image: {
		//flex: 1,
		height: '100%',
		alignSelf: 'flex-start',
		justifyContent: 'flex-start',
		//marginLeft: '12%',
		resizeMode: 'contain',
		//backgroundColor: 'white',
	},
	flagContainer: {
		backgroundColor: 'grey',
		flex: 1,
	},
});
