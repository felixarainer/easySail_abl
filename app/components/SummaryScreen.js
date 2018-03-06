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

  renderList = () => {
    return (
      <View>
        {this.state.boatClasses.map(elem => {
          return <Text>{elem}</Text>;
        })}
      </View>
    );
  };

  render() {
    const { state, navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/*LEFT FLEX BOX - REGATTA DATA*/}
        <View
          style={{
            flex: 1,
            // alignItems: 'center',
          }}
        >
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
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>{this.renderList()}</View>
          <Button
            onPress={() =>
              this.setState({
                promptVisible: true,
              })
            }
            title="Bootsklasse hinzufügen"
          />
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
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button
            /*onPress={() => navigate('Felx Teil')}*/ title="Speichern und starten"
          />
          <Button
            onPress={() => {
              this.saveData();
              navigate('Home');
            }}
            title="Speichern"
          />
          <Button onPress={() => navigate('Home')} title="Abbrechen" />
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
