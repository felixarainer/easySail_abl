// ActionView - Displays upcoming actions and remaining time
//
// ?TODO: display last action(s)
// TODO: add (static) action images; pass nextActions down from App.js as props

import React, { Component } from 'react';
import {
	AppRegistry,
	View,
	Text,
	StyleSheet,
	FlatList,
	Image,
} from 'react-native';
import ActionItem from './ActionItem';
import Countdown from './Countdown';
import moment from 'moment';
import * as res from '../res/res.js';
import globalstyles from '../styles.js';

export default class ActionView extends Component {
	constructor() {
		super();
	}

	render() {
		//console.log('AV.render()');
		return (
			<View style={styles.containerAV}>
				<View style={[{ flex: 3 }]}>
					<Text style={styles.title}>Nächste Aktionen:</Text>
					{this.props.actions.map(action => {
						return (
							<ActionItem
								style={globalstyles.actionViewItem}
								key={action.name}
								item={action}
							/>
						);
					})}
				</View>
				<View style={[{ flex: 1 }]}>
					<Countdown
						targetDate={this.props.countdownEndDate.toDate()}
						isSkippable={this.props.isSkippable}
						isIndefinite={false}
						onFinished={() => {
							//console.log('AV.render.onFinished()');
							this.props.onFinished();
						}}
						textStyle={globalstyles.countdownText}
						highlightStyle={globalstyles.buttonHighlight}
					/>
					{/* <Text style={{ fontSize: 20 }}>
						countdown end date: {this.props.countdownEndDate.format('LLL')}
					</Text> */}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	containerAV: {
		flex: 1,
		alignSelf: 'stretch',
		flexDirection: 'column',
		backgroundColor: '#a5b1c2',
	},
	title: { fontSize: 30, fontWeight: 'bold' },
});
