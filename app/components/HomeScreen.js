import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  AppRegistry,
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  static navigationOptions = {
    header: null,
  };

  fetchData = async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it
          let key = store[i][0];
          let value = store[i][1];

          var regattaData = JSON.parse(value);

          let obj = {
            key: key,
            regattaName: regattaData['regattaName'],
            startDate: regattaData['startDate'],
          };

          this.setState(prev => {
            return {
              data: [...prev.data, obj],
            };
          });
        });
      });
    });
  };

  renderList = navigate => {
    return (
      <View>
        {this.state.data.map((elem, index) => {
          return (
            <TouchableHighlight
              onPress={() =>
                navigate('Summary', { key: this.state.data[index].key })
              }
            >
              <Text>
                {elem.regattaName} am {elem.startDate}
              </Text>
            </TouchableHighlight>
          );
        })}
      </View>
    );
  };

  render() {
    const { state, navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {this.renderList(navigate)}
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button
            onPress={() => navigate('Summary', { key: '' })}
            title="Neue Regatta"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
