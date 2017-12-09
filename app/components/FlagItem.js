/* @flow */

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import resolveAssetSource from 'resolveAssetSource';

export default class FlagItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newWidth: 0,
			imageSize: undefined,
		};
	}
	/*
*	React automatically centers an image to the parent View when resizing
*
*/
	componentWillReceiveProps = () => {
		this.setState({ imageSize: undefined });
	};

	render() {
		//console.log('FlagItem.js: current image size = ' + this.state.imageSize);
		return (
			<View
				style={
					typeof this.state.imageSize !== 'undefined'
						? [this.props.style, { width: this.state.imageSize.height * 1.57 }]
						: [this.props.style, { opacity: 0 }]
				}
			>
				<Image
					style={
						typeof this.state.imageSize !== 'undefined'
							? [styles.image, this.state.imageSize]
							: [styles.image, { opacity: 0 }]
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
	//container: {},
	image: {
		height: '100%',
		resizeMode: 'contain',
	},
});
