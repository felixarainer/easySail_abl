import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import GridView from 'react-native-super-grid';
import moment from 'moment';
import Modal from 'react-native-modal';
import styles from '../styles.js';
import * as res from '../res/res.js';
import { StackNavigator } from 'react-navigation';

export default class App extends Component {
  constructor(){
    super();

    this.finalArray = [];

    this.state = {
      isUploaded: false,
    }

  }



  static navigationOptions = {
    header: null,
  };

  componentWillMount = () => {
    this.finalArray = this.props.navigation.state.params.finalArray;
    console.log(this.finalArray)
  }

  toggleIsUploaded = () => {
    this.setState({isUploaded: !this.state.isUploaded})
  }

  uploadArray = () => {
    Alert.alert('Uploads','Erfolgreicher upload der Daten - Weiterleiten zum webserver',[],{ cancelable: true })
    this.toggleIsUploaded();
  }

  viewTimes = () => {
    Linking.canOpenURL('http://www.derstandard.at').then(supported => {
      if (supported) {
        Linking.openURL('http://www.derstandard.at');
      } else {
        console.log('can\'t open url');
      }
    });
  }

  render() {
    return (
      <View style={stylesFinish.screenView}>
        {this.state.isUploaded ? (
          <TouchableOpacity
            onPress={() => {
              const { state, navigate } = this.props.navigation;
              navigate('Home');
            }}>
            <View style={stylesFinish.homeBtn}>
              <Text style={stylesFinish.btnText1}>Hauptmenü</Text>
            </View>
          </TouchableOpacity>
        ):(
          <View style={stylesFinish.btn_dis}>
            <Text style={stylesFinish.btnText1}>Hauptmenü</Text>
          </View>
        )}

        <View style={stylesFinish.athirdscreen}>
          <TouchableOpacity
            onPress={() => {
              this.uploadArray();
            }}>
            <View style={stylesFinish.uploadBtn}>
              <Text style={stylesFinish.btnText1}>Zeitdaten{'\n'}hochladen</Text>
            </View>
          </TouchableOpacity>
        </View>

        {this.state.isUploaded ? (
          <TouchableOpacity
            onPress={() => {
              this.viewTimes();
            }}>
            <View style={stylesFinish.viewBtn}>
              <Text style={stylesFinish.btnText1}>Zeidaten{'\n'}ansehen</Text>
            </View>
          </TouchableOpacity>
        ):(
          <View style={stylesFinish.btn_dis}>
            <Text style={stylesFinish.btnText1}>Zeidaten{'\n'}ansehen</Text>
          </View>
        )}
      </View>
    );
  }
}

const stylesFinish = StyleSheet.create({
  screenView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewBtn:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 200,
    backgroundColor: '#4b7bec',
    margin: 50,
  },
  uploadBtn:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 200,
    backgroundColor: '#26de81',
    margin: 50,
  },
  homeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 200,
    backgroundColor: '#fc5c65',
    margin: 50,
  },
  btn_dis:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 200,
    backgroundColor: 'lightgrey',
    margin: 50,
  },
  btnText1:{
    fontSize: 36,
    color: '#000',
  },
});
