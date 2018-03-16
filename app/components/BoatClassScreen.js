import React from 'react';
import {
  StyleSheet,
  AppRegistry,
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class BoatClassScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    const { navigate } = this.props.navigation;
    console.log(this.state.dateTime);
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TextInput
            placeholder="Name festlegen!"
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button onPress={() => navigate('Summary')} title="Weiter" />
          <Button onPress={() => navigate('Summary')} title="Abbrechen" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
