/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import ActionItem from './ActionItem';
import ActionTimer from './ActionTimer';

export default class ActionView extends Component {
  constructor() {
    super();
  }

  render() {
    let nextAction = {
      pic: {uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'},
      name: "TestAction1"
    }
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>ActionView component</Text>
        <ActionItem item={nextAction} />
        <ActionTimer />
        <ActionItem item={nextAction} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
