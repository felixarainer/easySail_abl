import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  AppRegistry,
  Text,
  TextInput,
  Image,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Keyboard,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import Prompt from 'react-native-prompt';
import * as res from '../res/res.js';
import styles from '../styles.js';
import Modal from 'react-native-modal';

export default class SummaryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      didExist: false,
      regattaKey: '',
      id: '',
      promptVisible: false,
      selectedIndex: 0,
      regattaName: '',
      startDate: '',
      startTime: '',
      boatTimeDifference: '',
      startFlag: 'P',
      boatClasses: [],
      teams: {},
      keyBoardup: false,
      newClass: 'Neue Bootsklasse',
    };

    this.newClass = 'Neue Bootsklasse';
  }

  componentWillMount() {
    this.fetchData();
  }

  _KeyboardDidShow() {
    this.setState({ keyBoardup: true });
  }

  _KeyboardDidHide() {
    this.setState({ keyBoardup: false });
  }

  static navigationOptions = {
    header: null,
  };

  addBoatClass = value => {
    if (value != 0) {
      this.setState({
        boatClasses: this.state.boatClasses.concat([value]),
      });
    }

    console.log('Ende addBoatClass:');
    console.log(this.state.boatClasses);
  };

  fetchData = async () => {
    const { state, navigate } = this.props.navigation;
    if (state.params.key != 0) {
      this.setState({ didExist: true, regattaKey: state.params.key });
      var regattaData = JSON.parse(
        await AsyncStorage.getItem(state.params.key)
      );

      this.setState({
        regattaName: regattaData.regattaName,
        startDate: regattaData.startDate,
        startTime: regattaData.startTime,
        boatTimeDifference: regattaData.boatTimeDifference,
        startFlag: regattaData.startFlag,
        id: regattaData.id,
      });

      regattaData.boatClasses.map(boatClass => {
        this.setState({
          boatClasses: this.state.boatClasses.concat([boatClass]),
        });
      });

      if (regattaData.startFlag == 'P') {
        this.setState({ selectedIndex: 0 });
      } else if (regattaData.startFlag == 'I') {
        this.setState({ selectedIndex: 1 });
      } else if (regattaData.startFlag == 'Z') {
        this.setState({ selectedIndex: 2 });
      } else if (regattaData.startFlag == 'U') {
        this.setState({ selectedIndex: 3 });
      } else if (regattaData.startFlag == 'Schwarz') {
        this.setState({ selectedIndex: 4 });
      }
    } else {
      console.log('key was empty -> did not print any data');
    }
  };

  //TODO: viewPDF()

  saveData = async () => {
    if (this.state.id != 0) {
      var request = new XMLHttpRequest();
      request.open(
        'POST',
        'https://easy-sail.herokuapp.com/api/participants',
        true
      );
      request.setRequestHeader(
        'Content-Type',
        'application/json; charset=UTF-8'
      );

      request.send(
        JSON.stringify({
          id: this.state.id,
        })
      );
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        this.setState({
          teams: JSON.parse(request.response),
        });

        console.log('response:');
        console.log(JSON.parse(request.response));
        console.log(this.state.teams);
      };
    } else {
      console.log('code is 0');
    }

    try {
      if (this.state.didExist == false) {
        await AsyncStorage.setItem(
          new Date().toTimeString(),
          JSON.stringify({
            regattaName: this.state.regattaName,
            startDate: this.state.startDate,
            startTime: this.state.startTime,
            boatTimeDifference: this.state.boatTimeDifference,
            startFlag: this.state.startFlag,
            boatClasses: this.state.boatClasses,
            regattaTimes: undefined,
            id: this.state.id,
            teams: this.state.teams,
          })
        );
      } else {
        await AsyncStorage.mergeItem(
          this.state.regattaKey,
          JSON.stringify({
            regattaName: this.state.regattaName,
            startDate: this.state.startDate,
            startTime: this.state.startTime,
            boatTimeDifference: this.state.boatTimeDifference,
            startFlag: this.state.startFlag,
            boatClasses: this.state.boatClasses,
            regattaTimes: undefined,
            id: this.state.id,
            teams: this.state.teams,
          })
        );
      }
    } catch (error) {
      console.warn('fehler beim schreiben');
    }
  };

  uploadResult = () => {
    //TODO: uploadResult()
  };

  switchElem = (oldPos, newPos) => {
    arr = this.state.boatClasses.slice();
    if (newPos >= 0 && newPos < arr.length) {
      let k = arr[oldPos];
      arr[oldPos] = arr[newPos];
      arr[newPos] = k;
      this.setState({ boatClasses: arr });
    }
  };

  removeElem = toDel => {
    this.setState({
      boatClasses: this.state.boatClasses.filter(
        (item, index) => index !== toDel
      ),
    });
  };

  renderList = () => {
    console.log('Anfang renderList:');
    console.log(this.state.boatClasses);
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        {this.state.boatClasses.map((elem, index) => {
          return (
            <View style={styles_summery.boatClassElem}>
              <Text style={styles_summery.boatClassName}>{elem}</Text>
              <TouchableHighlight
                onPress={() => {
                  this.switchElem(index, index - 1);
                }}
              >
                <Text style={styles_summery.moveBtn}>up </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.switchElem(index, index + 1);
                }}
              >
                <Text style={styles_summery.moveBtn}>down </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.removeElem(index);
                }}
              >
                <Text style={styles_summery.moveBtn}>remove</Text>
              </TouchableHighlight>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  toggleStartPicker = () => {
    if (!this.state.promptVisible) {
      this.setState({ newClass: 'Neue Bootsklasse' });
    }

    this.setState({ promptVisible: !this.state.promptVisible });
  };

  renderStartPicker = () => {
    console.log('renderStartPicker()');
    let startFlags = [
      res.flags.p,
      res.flags.u,
      res.flags.black,
      res.flags.i,
      res.flags.z,
    ];
    return (
      <View
        style={[{ flex: 1, flexDirection: 'column' }, styles.menuBackground]}
      >
        <View
          style={{
            flexDirection: 'row',
            flex: 2,
            margin: 10,
            marginBottom: 0,
          }}
        >
          <Text
            style={[
              styles.descriptionText,
              { flex: 1, fontWeight: 'bold', fontSize: 40 },
            ]}
          >
            Wählen sie eine Flagge:{' '}
          </Text>
          {startFlags.map(flag => {
            return (
              <TouchableHighlight
                key={flag.name}
                style={[
                  styles.spHighlight,
                  this.state.badStartCondition === flag.name &&
                    styles.toggleButton,
                ]}
                onPress={() => {
                  this.setState({
                    badStartCondition: flag.name,
                    flagDescription: flag.description,
                  });
                }}
              >
                <Image source={flag.pic} style={styles.spFlagImage} />
              </TouchableHighlight>
            );
          })}
        </View>
        <View style={{ flex: 3, paddingHorizontal: 10 }}>
          <Text style={styles.descriptionText}>
            <Text style={{ fontWeight: 'bold' }}>{'Beschreibung: '}</Text>
            {this.state.flagDescription}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableHighlight
            style={[styles.buttonHighlight, styles.cancelButton]}
            underlayColor="#fc5c65"
            onPress={() => {
              this.toggleStartPicker();
            }}
          >
            <Text style={styles.buttonLabel}>Abbrechen</Text>
          </TouchableHighlight>
          <TextInput
            style={{
              width: 500,
              fontSize: 36,
              height: 100,
              borderColor: 'gray',
              backgroundColor: 'lightblue',
              borderWidth: 1,
            }}
            onChangeText={text => {
              this.setState({ newClass: text });
              this.forceUpdate();
            }}
            value={this.state.newClass}
          />

          <TouchableHighlight
            style={[styles.buttonHighlight, styles.okButton]}
            underlayColor="#26de81"
            onPress={() => {
              this.addBoatClass(this.state.newClass);
              this.toggleStartPicker();
            }}
          >
            <Text style={styles.buttonLabel}>Bestätigen</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  render() {
    const { state, navigate } = this.props.navigation;
    return (
      <View style={styles_summery.container}>
        {/*LEFT FLEX BOX - REGATTA DATA*/}
        <View style={styles_summery.regattaData}>
          <View style={styles_summery.regattaDataElem}>
            <Text>Name: </Text>
            <TextInput
              style={{ width: 100 }}
              placeholder="Regattaname"
              onChangeText={regattaName => this.setState({ regattaName })}
              value={this.state.regattaName}
            />
          </View>
          <View style={styles_summery.regattaDataElem}>
            <Text>Startdatum: </Text>
            <TextInput
              style={{ width: 100 }}
              placeholder="DD.MM.JJ"
              onChangeText={startDate => this.setState({ startDate })}
              value={this.state.startDate}
            />
          </View>
          <View style={styles_summery.regattaDataElem}>
            <Text>Startzeit: </Text>
            <TextInput
              style={{ width: 100 }}
              placeholder="hh:mm"
              onChangeText={startTime => this.setState({ startTime })}
              value={this.state.startTime}
            />
          </View>
          <View style={styles_summery.regattaDataElem}>
            <Text>Startdifferenz der Bootsklassen: </Text>
            <TextInput
              style={{ width: 100 }}
              placeholder="mm"
              onChangeText={boatTimeDifference =>
                this.setState({ boatTimeDifference })
              }
              value={this.state.boatTimeDifference}
            />
          </View>
          <View style={styles_summery.regattaDataElem}>
            <Text>Code vom Server: </Text>
            <TextInput
              style={{ width: 100 }}
              placeholder="xxxx"
              onChangeText={id => this.setState({ id })}
              value={this.state.id}
            />
          </View>
        </View>
        <View
          style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}
        >
          <View style={{ flex: 3.33, alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>{this.renderList()}</View>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles_summery.touchableOpacityBtn}
              onPress={() => this.toggleStartPicker()}
            >
              <Text style={styles_summery.btnText}>Neue Bootsklasse</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*RIGHT FLEX BOX - NEXT ACTIONS*/}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={styles_summery.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                this.uploadResult();
              }}
              style={styles_summery.touchableOpacityBtn}
            >
              <Text style={styles_summery.btnText}>Hochladen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles_summery.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                this.viewPDF();
              }}
              style={styles_summery.touchableOpacityBtn}
            >
              <Text style={styles_summery.btnText}>Ergebnis</Text>
            </TouchableOpacity>
          </View>

          <View style={styles_summery.btnContainer}>
            <TouchableOpacity
              style={styles_summery.touchableOpacityBtn}
              onPress={() => {
                this.saveData();
                navigate('Start', {
                  start: true,
                  regattaKey: this.state.regattaKey,
                });
              }}
            >
              <Text style={styles_summery.btnText}>Starten</Text>
            </TouchableOpacity>
          </View>
          <View style={styles_summery.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                this.saveData();
                navigate('Home');
              }}
              style={styles_summery.touchableOpacityBtn}
            >
              <Text style={styles_summery.btnText}>Speichern</Text>
            </TouchableOpacity>
          </View>
          <View style={styles_summery.btnContainer}>
            <TouchableOpacity
              onPress={() => navigate('Home')}
              style={styles_summery.touchableOpacityBtn}
            >
              <Text style={styles_summery.btnText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal isVisible={this.state.promptVisible}>
          {this.renderStartPicker()}
        </Modal>
      </View>
    );
  }
}

const styles_summery = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableOpacityBtn: {
    width: 205,
    borderWidth: 2,
    borderColor: '#45c1bd',
    borderRadius: 4,
    padding: 20,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    color: '#45c1bd',
  },
  regattaData: {
    flex: 1,
    marginLeft: '5%',
  },
  regattaDataElem: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  boatClassElem: {
    flexDirection: 'row',
  },
  boatClassName: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  moveBtn: {
    color: '#45c1bd',
  },
});
