// FlagItem - Used by FlagView to display a Flag Object as an Image
//
// React automatically centers an image to the parent View when resizing. This
// makes it impossible to display the flags at the desired spots. To circum-
// vent this, I initially render the image at the incorrect, centered position
// and take its (rendered) height, and then render it again with
// 			renderWidth=renderHeight*ratio			ratio=imgWidth/imgHeight
//
// 	TODO: calculate ratio instead of using props
// 	TODO: add TouchableHighlight with onCLick = () => {showFlagDescription()}
//

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import resolveAssetSource from 'resolveAssetSource';

export default class FlagItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSize: undefined,
		};
	}

	componentWillReceiveProps = () => {
		this.setState({ imageSize: undefined });
	};

	render() {
		return (
			<View
				style={
					typeof this.state.imageSize === 'undefined'
						? { opacity: 0 }
						: { width: this.state.imageSize.height * 1.57 }
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
