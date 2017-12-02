/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class FlagView extends Component<{}>{
  render() {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>FlagView component</Text>
        <View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#555',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('FlagView', () => FlagView);
