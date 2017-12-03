import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionView from './components/ActionView';
import FlagView from './components/FlagView';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      schedule: [
        {
          flag:"",
          action:{},
          countdown:{},
        }
      ]
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <FlagView />
        <ActionView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
