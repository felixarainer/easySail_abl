/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

export default class FlagView extends Component{
  constructor(props){
    super(props);
    this.state = {
      flag1: {
        name: "returnflag",
        pic: {
          uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
        }
      }

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>FlagView component</Text>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Image source = {flag1.pic}/>
            <Text>{flag1.name}</Text>
          </View>
          <View><Text>Flag 2</Text></View>
          <View><Text>Flag 3</Text></View>
          <View><Text>Flag 4</Text></View>
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
