/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

const COUNTDOWN_NOT_STARTED = 1
const COUNTDOWN_STARTED = 2
const COUNTDOWN_FINISHED = 3

export default class Countdown extends Component{
  constructor(props){
    super(props)
    this.state = {
      remainingTime: 0,
      status: COUNTDOWN_NOT_STARTED,
      intervalId: null
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      let timer = setInterval(() => {
        this.tick()
      }, this.props.interval)

      this.setState({
        status: COUNTDOWN_STARTED,
        intervalId: timer
      })

      this.tick()
    }, this.props.startDelay)
  }

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId)
  }

  calculateRemainingTime = () => {
    return -1 * moment().diff(this.props.targetDate)
  }

  addLeadingZero = (value) => {
    if (value < 10) {
      return '0' + value.toString()
    }
    return value
  }

  tick = () => {
    this.setState({
      remainingTime: this.calculateRemainingTime()
    })

    if (this.state.remainingTime <= 0) {
      this.setState({
        status: COUNTDOWN_FINISHED
      })

      if (this.props.onFinished) {
        this.props.onFinished()
      }
      clearInterval(this.state.intervalId)
    }
  }

  renderRemainingTime = () => {
    let returnValue = []
    let { remainingTime } = this.state

    let minutes = moment.duration(remainingTime).get('minutes');
    let seconds = moment.duration(remainingTime).get('seconds');

    return (<Text style={this.props.style}>{minutes}:{seconds}</Text>)
}

  render() {
    console.log("render");
    if (this.state.remTime==0) {
      console.log("setting new state to " + this.props.duration);
      this.state.remTime = this.props.duration;
      console.log("new state: remtime=" + this.state.remTime);
    }
    return (
      <View>
        {this.renderRemainingTime()}
      </View>
    );
  }
}

Countdown.propTypes = {
  targetDate: PropTypes.instanceOf(Date).isRequired,
  interval: PropTypes.number,
  startDelay: PropTypes.number,
  onFinished: PropTypes.func,
  style: Text.propTypes.style,
}

Countdown.defaultProps = {
  interval: 1000,
  startDelay: 0,
  style: {fontSize: 56, fontWeight: 'bold'},
}
