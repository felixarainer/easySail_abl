/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

export default class FlagItem extends Component {
  render() {
    return (
      <View>
        <Image source = {this.props.flag.pic}/>
        <Text>{this.props.flag.name}</Text>
      </View>
    );
  }
}
