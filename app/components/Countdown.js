// Countdown - displays xx:xx countdown, calls callback prop onFinished() upon
// 		reaching 00:00
//
// TODO migrate logic to App.js / Redux to allow fullscreen FlagView / differ-
//		ent screens in general without breaking the countdown
//TODO Design: Wenn countdown fertig solle die rechte komponente blinken, damit der user weis, dass sie ncht freezed is..

import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import globalstyles from '../styles.js';

const COUNTDOWN_NOT_STARTED = 1;
const COUNTDOWN_STARTED = 2;
const COUNTDOWN_FINISHED = 3;

export default class Countdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			remainingTime: 0,
			status: COUNTDOWN_NOT_STARTED,
			intervalId: null,
			skippable: false,
		};
	}

	componentDidMount = () => {
		clearInterval(this.state.intervalId); //TODO not sure if needed
		if (!this.props.isIndefinite) {
			setTimeout(() => {
				let timer = setInterval(() => {
					this.tick();
				}, this.props.interval);

				this.setState({
					status: COUNTDOWN_STARTED,
					intervalId: timer,
				});

				this.tick();
			}, this.props.startDelay);
		}
	};

	componentWillReceiveProps = newProps => {
		if (moment(newProps.targetDate).diff(this.props.targetDate) !== 0) {
			clearInterval(this.state.intervalId); //TODO not sure if needed
			if (!this.props.isIndefinite) {
				setTimeout(() => {
					let timer = setInterval(() => {
						this.tick();
					}, this.props.interval);

					this.setState({
						status: COUNTDOWN_STARTED,
						intervalId: timer,
					});

					this.tick();
				}, this.props.startDelay);
			}
		}
	};

	componentWillUnmount = () => {
		//console.log('Countdown.componentWillUnmount()');
		clearInterval(this.state.intervalId);
	};

	calculateRemainingTime = () => {
		//console.log('Countdown.calculateRemainingTime()');
		if (moment().diff(this.props.targetDate) < 0) {
			return -1 * moment().diff(this.props.targetDate);
		} else {
			return 0;
		}
	};

	addLeadingZero = value => {
		if (value < 10) {
			return '0' + value.toString();
		}
		return value;
	};

	tick = () => {
		//console.log('Countdown.tick()');
		if (this.state.status == COUNTDOWN_STARTED) {
			//console.log('Countdown.tick() lastRemTime:' + this.state.remainingTime);
			this.setState({
				remainingTime: this.calculateRemainingTime(),
			});

			if (this.state.remainingTime <= 0) {
				//console.log('ending countdown');
				this.endCountdown();
				if (this.props.onFinished && !this.props.isSkippable) {
					this.props.onFinished();
				}
			}
		}
	};

	endCountdown = () => {
		console.log('Countdown.endCountdown()');

		this.setState({
			status: COUNTDOWN_FINISHED,
		});

		clearInterval(this.state.intervalId);
	};

	skipCountdown = () => {
		console.log('Countdown.skipCountdown()');
		if (this.props.isSkippable) {
			this.endCountdown();
			if (this.props.onFinished) {
				this.props.onFinished();
			}
		}
	};

	render() {
		let returnValue = [];
		let { remainingTime } = this.state;

		let minutes = this.addLeadingZero(
			moment.duration(remainingTime).get('minutes')
		);
		let seconds = this.addLeadingZero(
			moment.duration(remainingTime).get('seconds')
		);
		return (
			<TouchableOpacity
				style={[
					this.props.highlightStyle,
					this.props.isSkippable
						? { backgroundColor: '#26de81' }
						: { backgroundColor: 'transparent' },
				]}
				onPress={() => this.skipCountdown()}
			>
				<Text style={this.props.textStyle}>
					{minutes}:{seconds}
				</Text>
			</TouchableOpacity>
		);
	}
}

Countdown.propTypes = {
	targetDate: PropTypes.instanceOf(Date), //.isRequired,
	interval: PropTypes.number,
	startDelay: PropTypes.number,
	onFinished: PropTypes.func,
	style: Text.propTypes.style,
	isSkippable: PropTypes.bool,
	isIndefinite: PropTypes.bool,
};

Countdown.defaultProps = {
	interval: 1000,
	startDelay: 0,
	isSkippable: false,
	isIndefinite: false,
};
