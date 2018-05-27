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
  ScrollView,
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
      <ScrollView
        style={styles.table}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        {this.state.data.map((elem, index) => {
          return (
            <TouchableOpacity
              key={elem.regattaName}
              style={styles.tableElement}
              onPress={() =>
                navigate('Summary', { key: this.state.data[index].key })
              }
            >
              <Text style={styles.tableElementText}>{elem.regattaName}</Text>
              <Text>{elem.startDate}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  render() {
    const { state, navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
          }}
        >
          {this.renderList(navigate)}
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.touchableOpacityBtn}
            onPress={() => navigate('Summary', { key: '' })}
          >
            <Text style={styles.btnText}>Neue Regatta</Text>
          </TouchableOpacity>
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
  touchableOpacityBtn: {
    width: 205,
    borderWidth: 2,
    borderColor: '#45c1bd',
    borderRadius: 4,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    color: '#45c1bd',
  },
  table: {
    marginLeft: '40%',
  },
  tableElement: {
    padding: 3,
  },
  tableElementText: {
    fontSize: 20,
  },
});
