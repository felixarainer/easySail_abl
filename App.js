import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionView from './app/components/ActionView';
import FlagView from './app/components/FlagView';

export default class App extends React.Component {
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
