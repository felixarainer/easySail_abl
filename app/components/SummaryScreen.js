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
//import Prompt from 'react-native-prompt';

export default class SummaryScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			promptVisible: false,
			regattaName: '',
			startDate: '',
			startTime: '',
			boatTimeDifference: '',
			startFlag: '',
			boatClasses: [],
		};
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

	saveData = async () => {
		try {
			await AsyncStorage.setItem(
				this.state.regattaName + this.state.startDate,
				JSON.stringify({
					regattaName: this.state.regattaName,
					startDate: this.state.startDate,
					startTime: this.state.startTime,
					boatTimeDifference: this.state.boatTimeDifference,
					startFlag: this.state.startFlag,
					boatClasses: this.state.boatClasses,
				})
			);
		} catch (error) {
			console.warn('fehler beim schreiben');
		}
	};

	render() {
		const { navigate } = this.props.navigation;
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
							<RadioButton value={'X'}>
								<Text>X</Text>
							</RadioButton>
						</RadioGroup>
						<Text>{this.state.regattaName}</Text>
						<Text>{this.state.startDate}</Text>
						<Text>{this.state.startTime}</Text>
						<Text>{this.state.boatTimeDifference}</Text>
						<Text>{this.state.startFlag}</Text>
					</View>
				</View>
				{/*MID FLEX BOX - BOATCLASS STUFF*/}
				<View style={{ flex: 1, alignItems: 'center' }}>
					<FlatList
						data={this.state.boatClasses}
						renderItem={({ item }) => <Text>{item}</Text>}
						ItemSeparatorComponent={this.renderSeparator}
					/>
					<Button
						onPress={() =>
							this.setState({
								promptVisible: true,
							})
						}
						title="Bootsklasse hinzufügen"
					/>
					{/* <Prompt
            title="Neue Bootsklasse"
            visible={this.state.promptVisible}
            onCancel={() =>
              this.setState({
                promptVisible: false,
              })
            }
            onSubmit={value =>
              this.setState({
                promptVisible: false,
                boatClasses: this.state.boatClasses.concat([value]),
              })
            }
          /> */}
				</View>
				{/*RIGHT FLEX BOX - NEXT ACTIONS*/}
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Button
						onPress={() => navigate('Start')}
						title="Speichern und starten"
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
