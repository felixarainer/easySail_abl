import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionView from './components/ActionView';
import FlagView from './components/FlagView';
import Orientation from 'react-native-orientation-locker';

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
  componentDidMount = () => {
    //ggf zu lockTolandscapeLeft() aendern
    Orientation.lockToLandscape();
  }
  render() {
    return (
      <View style={styles.container}>
        <FlagView />
        <ActionView onFinished= {() => {

        }}/>
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
