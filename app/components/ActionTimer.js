/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class ActionTimer extends Component {
  render() {
    let min = 2;
    let sec = 32;
    return (
      <View>
        <Text style = {{fontSize: 56, fontWeight: 'bold',}}>{min}:{sec}</Text>
      </View>
    );
  }
}
