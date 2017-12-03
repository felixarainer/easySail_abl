/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class ActionTimer extends Component{
  constructor(props){
    super(props);
    this.state = {
      remTime: this.props.duration
    }
    setInterval(() => {
      this.setState(previousState =>{
        return {remTime: previousState.remTime-1};
      });
    }, 1000);
  }

  componentWillUpdate(){
    console.log("componentWillUpdate: remtime=" + this.state.remTime);
  }

  render() {
    console.log("render");
    let min = Math.floor(this.state.remTime / 60);
    let sec = this.state.remTime % 60;
    if (this.state.remTime==0) {
      console.log("setting new state to " + this.props.duration);
      this.state.remTime = this.props.duration;
      console.log("new state: remtime=" + this.state.remTime);
    }
    return (
      <View>
        <Text style = {{fontSize: 56, fontWeight: 'bold',}}>{min}:{sec}</Text>
      </View>
    );
  }
}
