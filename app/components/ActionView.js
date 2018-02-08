// ActionView - Displays upcoming actions and remaining time
//
// ?TODO: display last action(s)
// TODO: add (static) action images; pass nextActions down from App.js as props
//

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

export default class ActionView extends Component {
	constructor() {
		super();
		this.state = {
			nextActions: [
				{
					name: 'Startschuss',
					actionPic: res.actions.signal_1,
					flagPic: undefined,
				},
				{
					name: 'Flagge bergen',
					actionPic: res.actions.flag_down,
					flagPic: res.flags.z,
				},
			],
			//endDate: moment().add(5, 'seconds'),
		};
	}

	render() {
		console.log('AV.render()');
		return (
			<View style={styles.containerAV}>
				<View style={styles.actionContainer}>
					<Text style={styles.title}>next Actions:</Text>
					{this.state.nextActions.map(action => {
						return <ActionItem key={action.name} item={action} />;
					})}
				</View>
				<View style={styles.actionContainer}>
					<Text style={styles.title}>remaining time:</Text>
					<Countdown
						targetDate={this.props.countdownEndDate.toDate()}
						isSkippable={true}
						onFinished={() => {
							console.log('AV.render.onFinished()');
							this.props.onFinished();
						}}
						style={styles.countdownText}
					/>
					<Text style={{ fontSize: 20 }}>
						countdown end date: {this.props.countdownEndDate.format('LLL')}
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	containerAV: {
		flex: 1,
		backgroundColor: 'lightblue',
		alignSelf: 'stretch',
		flexDirection: 'column',
		//justifyContent: 'center',
		alignItems: 'flex-start',
	},
	actionContainer: {
		margin: '5%',
		marginBottom: 0,
		padding: '5%',
		borderWidth: 1,
		backgroundColor: 'lightgreen',
		alignSelf: 'stretch',
		//alignItems: 'center',
		//justifyContent: 'space-between',
	},
	title: { fontSize: 30, fontWeight: 'bold' },
	countdownText: { fontSize: 56, fontWeight: 'bold' },
});
