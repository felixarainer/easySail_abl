/* @flow */

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import resolveAssetSource from 'resolveAssetSource';
//import LeftAlignedImage from 'react-native-left-aligned-image';

export default class FlagItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newWidth: 0,
		};
	}

	render() {
		return (
			<View style={[styles.flagContainer, this.props.style]}>
				<Image
					style={
						typeof this.state.imageSize !== 'undefined'
							? [styles.image, this.state.imageSize]
							: styles.image
					}
					source={this.props.flag.pic}
					onLayout={event => {
						const { x, y, width, height } = event.nativeEvent.layout;
						this.setState({
							imageSize: {
								width: height * this.props.flag.ratio,
								height: height,
							},
						});
					}}
				/>
				{/*<Text>{this.props.flag.name}</Text>*/}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	image: {
		height: '100%',
		resizeMode: 'contain',
	},
	flagContainer: {
		//flex: 1,
		//backgroundColor: 'grey',
		//flex: 1,
	},
});
