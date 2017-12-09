/* @flow */

import React, { Component } from 'react';
import { AppRegistry, View, Text, StyleSheet, FlatList } from 'react-native';
import ActionItem from './ActionItem';
import Countdown from './Countdown';
import moment from 'moment';

export default class ActionView extends Component {
	constructor() {
		super();
		this.state = {
			action1: {
				pic: {
					uri:
						'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
				},
				name: 'TestAction1',
			},
			action2: {
				pic: {
					uri:
						'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
				},
				name: 'TestAction2',
			},
			nextActions: [
				{
					pic: {
						uri:
							'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
					},
					name: 'TestAction1',
				},
				{
					pic: {
						uri:
							'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
					},
					name: 'TestAction2',
				},
			],
			//endDate: moment().add(5, 'seconds'),
		};
	}

	render() {
		return (
			<View style={styles.containerAV}>
				<View style={styles.actionContainer}>
					<Text style={styles.title}>next Actions:</Text>
					{this.state.nextActions.map(action => {
						return <ActionItem key={action.name} item={action} />;
					})}
				</View>
				<View style={styles.actionContainer}>
					<Text style={styles.title}>remaining time</Text>
					<Countdown
						targetDate={this.props.countdownEndDate.toDate()}
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
		alignItems: 'center',
	},
	actionContainer: {
		margin: '5%',
		padding: '5%',
		backgroundColor: 'lightgreen',
		alignSelf: 'stretch',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: { fontSize: 30, fontWeight: 'bold' },
	countdownText: { fontSize: 56, fontWeight: 'bold' },
});
