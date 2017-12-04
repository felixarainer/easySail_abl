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
import Countdown from './Countdown';
import moment from 'moment';

export default class ActionView extends Component{
  constructor() {
    super();
    this.state = {
      action1: {
        pic: {uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'},
        name: "TestAction1"
      },
      action2: {
        pic: {uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'},
        name: "TestAction2"
      },
      nextAction: {},
      endDate: moment().add(15,'seconds'),
    }
    this.state.nextAction = this.state.action1;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>ActionView component</Text>
        <ActionItem item={this.state.nextAction} />
        <Text>countdown end date: {this.state.endDate.format('LLL')}</Text>
        <Countdown targetDate={this.state.endDate.toDate()} onFinished={() => {
          console.log("countdown has ended");
          this.state.nextAction = this.state.action2;
          this.forceUpdate();
        }}/>
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
