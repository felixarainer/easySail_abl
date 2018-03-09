import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  AppRegistry,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import Prompt from 'react-native-prompt';

export default class SummaryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      didExist: false,
      regattaKey: '',
      promptVisible: false,
      selectedIndex: 0,
      regattaName: '',
      startDate: '',
      startTime: '',
      boatTimeDifference: '',
      startFlag: 'P',
      boatClasses: [],
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  static navigationOptions = {
    header: null,
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  addBoatClass = value => {
    if (value != 0) {
      this.setState({
        boatClasses: this.state.boatClasses.concat([value]),
      });
    }

    this.setState({
      promptVisible: false,
    });

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

  saveData = async () => {
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
          })
        );
      }
    } catch (error) {
      console.warn('fehler beim schreiben');
    }
  };

  moveUp = index => {
    console.log('Anfang moveUp:');
    console.log(this.state.boatClasses);
    if (index != 0) {
      var cache = this.state.boatClasses[index - 1];
      var boatClasses = this.state.boatClasses;

      boatClasses[index - 1] = this.state.boatClasses[index];
      boatClasses[index] = cache;

      boatClasses.map(boatClass => {
        this.setState({
          boatClasses: this.state.boatClasses.concat([boatClass]),
        });
      });

      console.log('Nach moveUp');
      console.log(this.state.boatClasses);
    }
  };

  moveDown = index => {
    console.log('Anfang moveDown:');
    console.log(this.state.boatClasses);

    if (index != this.state.boatClasses.length - 1) {
      var cache = this.state.boatClasses[index + 1];
      var boatClasses = this.state.boatClasses;

      boatClasses[index + 1] = this.state.boatClasses[index];
      boatClasses[index] = cache;

      boatClasses.map(boatClass => {
        this.setState({
          boatClasses: this.state.boatClasses.concat([boatClass]),
        });
      });
      console.log('Nach moveDown:');
      console.log(this.state.boatClasses);
    }
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
            <View>
              <Text>{elem}</Text>
              <TouchableHighlight
                onPress={() => {
                  this.moveUp(index);
                }}
              >
                <Text>up</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.moveDown(index);
                }}
              >
                <Text>down</Text>
              </TouchableHighlight>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  render() {
    const { state, navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/*LEFT FLEX BOX - REGATTA DATA*/}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Name: </Text>
            <TextInput
              placeholder="Regattaname"
              onChangeText={regattaName => this.setState({ regattaName })}
              value={this.state.regattaName}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Startdatum: </Text>
            <TextInput
              placeholder="DD.MM.JJ"
              onChangeText={startDate => this.setState({ startDate })}
              value={this.state.startDate}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Startzeit: </Text>
            <TextInput
              placeholder="hh:mm"
              onChangeText={startTime => this.setState({ startTime })}
              value={this.state.startTime}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Startdifferenz der Bootsklassen: </Text>
            <TextInput
              placeholder="mm"
              onChangeText={boatTimeDifference =>
                this.setState({ boatTimeDifference })
              }
              value={this.state.boatTimeDifference}
            />
          </View>
          <View>
            <RadioGroup
              selectedIndex={this.state.selectedIndex}
              onSelect={(index, value) => this.setState({ startFlag: value })}
            >
              <RadioButton value={'P'}>
                <Text>P</Text>
              </RadioButton>
              <RadioButton value={'I'}>
                <Text>I</Text>
              </RadioButton>
              <RadioButton value={'Z'}>
                <Text>Z</Text>
              </RadioButton>
              <RadioButton value={'U'}>
                <Text>U</Text>
              </RadioButton>
              <RadioButton value={'Schwarz'}>
                <Text>Schwarz</Text>
              </RadioButton>
            </RadioGroup>
          </View>
        </View>
        {/*MID FLEX BOX - BOATCLASS STUFF*/}
        <View
          style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}
        >
          <View style={{ flex: 3.33, alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>{this.renderList()}</View>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.touchableOpacityBtn}
              onPress={() => this.setState({ promptVisible: true })}
            >
              <Text style={styles.btnText}>Neue Bootsklasse</Text>
            </TouchableOpacity>
          </View>
          <Prompt
            title="Neue Bootsklasse"
            visible={this.state.promptVisible}
            onCancel={() =>
              this.setState({
                promptVisible: false,
              })
            }
            onSubmit={value => this.addBoatClass(value)}
          />
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
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={
                styles.touchableOpacityBtn
              } onPress={() => navigate('Start',{start: true, regattaKey: this.state.regattaKey})}
            >
              <Text style={styles.btnText}>Starten</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                this.saveData();
                navigate('Home');
              }}
              style={styles.touchableOpacityBtn}
            >
              <Text style={styles.btnText}>Speichern</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => navigate('Home')}
              style={styles.touchableOpacityBtn}
            >
              <Text style={styles.btnText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
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
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableOpacityBtn: {
    borderWidth: 2,
    borderColor: '#45c1bd',
    borderRadius: 4,
    padding: 20,
    marginVertical: 15,
  },
  btnText: {
    fontSize: 20,
    color: '#45c1bd',
  },
});
