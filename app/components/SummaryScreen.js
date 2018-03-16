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
      promptVisible: false,
      selectedIndex: 0,
      regattaName: '',
      startDate: '',
      startTime: '',
      boatTimeDifference: '',
      startFlag: 'P',
      boatClasses: [],
      keyBoardup: false,
      newClass: 'Neue Bootsklasse',
    };

    this.newClass = 'Neue Bootsklasse'
  }

  componentWillMount() {
    this.fetchData();
  }

  _KeyboardDidShow() {
    this.setState({keyBoardup: true});
  }

  _KeyboardDidHide() {
    this.setState({keyBoardup: false});
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
            regattaTimes: undefined,
            serverCode: '1a2b',
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
            serverCode: '1a2b',
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
            <View key={elem}>
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

  toggleStartPicker = () => {
    if(!this.state.promptVisible){
      this.setState({newClass: 'Neue Bootsklasse'});
    }

    this.setState({ promptVisible: !this.state.promptVisible });
  };

  renderStartPicker = () => {
		console.log('renderStartPicker()');
		let startFlags = [res.flags.p, res.flags.u, res.flags.black, res.flags.i, res.flags.z];
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
            style={{width: 500, fontSize: 36, height: 100, borderColor: 'gray', backgroundColor: 'lightblue', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({newClass: text});
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
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Name: </Text>
            <TextInput
              style={{width: 100}}
              placeholder="Regattaname"
              onChangeText={regattaName => this.setState({ regattaName })}
              value={this.state.regattaName}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Startdatum: </Text>
            <TextInput
              style={{width: 100}}
              placeholder="DD.MM.JJ"
              onChangeText={startDate => this.setState({ startDate })}
              value={this.state.startDate}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Startzeit: </Text>
            <TextInput
              style={{width: 100}}
              placeholder="hh:mm"
              onChangeText={startTime => this.setState({ startTime })}
              value={this.state.startTime}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Startdifferenz der Bootsklassen: </Text>
            <TextInput
              style={{width: 100}}
              placeholder="mm"
              onChangeText={boatTimeDifference =>
                this.setState({ boatTimeDifference })
              }
              value={this.state.boatTimeDifference}
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
              style={
                styles_summery.touchableOpacityBtn
              }
               onPress={() =>
                 navigate('Start',{start: true, regattaKey: this.state.regattaKey}
               )}
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
