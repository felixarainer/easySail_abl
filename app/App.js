// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions (TODO) / Count-
// 	down to children as props i.e. sets next state for the whole app ('Regelsys-
//	tem')

import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Button,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import ActionView from './components/ActionView';
import FlagItem from './components/FlagItem';
import Orientation from 'react-native-orientation-locker';
import * as res from './res/res.js';
import moment from 'moment';
import Modal from 'react-native-modal';

const PRE_RACE = 0;
const PRE_START = 1;
const START = 2;
const RACING = 3;

class actState {
	//isstart sagt aus, ob dieses ereignis in der Liste ein Startereignis ist
	constructor(flags, actions, time, isStart, rank, isIndefinite, isSkippable) {
		this.flags = flags;
		this.actions = actions;
		this.time = time;
		this.isStart = isStart;
		this.rank = rank;
		this.isIndefinite = isIndefinite;
		this.isSkippable = isSkippable;
	}

	getState = () => {
		return {
			curFlags: {
				flag1: this.flags[0],
				flag2: this.flags[1],
				flag3: this.flags[2],
				flag4: this.flags[3],
			},
			curActions: this.actions,
			countdownEndDate:
				typeof this.time === 'number'
					? moment().add(this.time, 'seconds')
					: this.time,
			isIndefinite: this.isIndefinite,
			isSkippable: this.isSkippable,
		};
	};

	getFlags = () => {
		return this.flags;
	};

	setFlags = newFlags => {
		this.flags = newFlags;
	};

	wasStart = () => {
		return this.isStart;
	};

	getTime = () => {
		return this.time;
	};

	addTime = (time, unit) => {
		this.time = moment(this.time).add(time, unit);
	};

	subtractTime = (time, unit) => {
		this.time = moment(this.time).subtract(time, unit);
	};

	getRank = () => {
		return this.rank;
	};
}

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			curFlags: {},
			viewBadStartBtns: false,
			startFinished: false,
			viewStartPicker: false,
			isModalVisible: false,
			phase: PRE_RACE,
			specialDescription: '',
			isSkippable: undefined,
			isIndefinite: undefined,
			specialChoice: undefined,
			isSpecial: false,
		};
		this.step = 0;

		this.specialBtnsDescs = [
			{
				choice: 0,
				button: 'Verschieben (kurz)',
				description:
					'Alle noch nicht gestarteten Rennen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP". \nWenn Sie die Wettfahrt fortführen möchten klicken Sie auf den Countdown',
			},
			{
				choice: 1,
				button: 'Verschieben (lang)',
				description:
					'Alle noch nicht gestarteten Rennen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP" über der Flagge "H". \nWeitere Signale an Land geben.',
			},
			{
				choice: 2,
				button: 'Verschieben und abbrechen',
				description:
					'Alle noch nicht gestarteten Rennen werden verschoben. \nHeute findet keine Wettfahrt mehr statt. Bereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP" über der Flagge "A".',
			},
		];
	}

	componentWillMount() {
		this.actlist = this.createStartStates([
			{
				//time: moment().add(150, 's'), //2,5min
				condition: 'i',
				badstart: false,
			},
		]);
		this.setInitialFlags();
	}

	createStartStates = args => {
		let ac = [];

		args.forEach(start => {
			starttime = moment(start.time).subtract(6, 'minutes');
			//starttime = moment(start.time).subtract(2, 'minutes');

			//1ste aktion
			if (start.badstart) {
				ac.push(
					new actState(
						[res.flags.fhs, {}, {}, {}],
						[
							{
								name: 'TestAction2',
								actionPic: res.actions.flag_down,
								flagPic: res.flags.x,
							},
						],
						starttime,
						false,
						0,
						false,
						false
					)
				);
			} else {
				ac.push(
					//flagge l setzen und 6 min vor Start bergen
					new actState(
						[res.flags.l, {}, {}, {}],
						[
							{
								name: 'TestAction2',
								actionPic: res.actions.flag_down,
								flagPic: res.flags.l,
							},
						],
						moment().add(5, 's'),
						false,
						0,
						false,
						false
					)
				);
			}

			//2te aktion
			//l ist geborgen und in einer minute ankündigungssignal + Klassenflagge
			ac.push(
				new actState(
					[res.flags.black, {}, {}, {}],
					[
						{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_up,
							flagPic: res.flags.klass,
						},
					],
					moment(starttime).add(1, 'm'),
					//moment(starttime).add(15, 's'),
					false,
					1,
					false,
					false
				)
			);

			ac.push(
				//this.setp = 2
				//3te aktion
				//Klassenflagge gesetzt
				//in einer minute Vorbereitungssignal und Startmethode
				new actState(
					[res.flags.klass, {}, {}, {}],
					[
						{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_up,
							//TODO damir fragen wegen res.flags.{start.condition}
							flagPic: res.flags[start.condition],
						},
					],
					moment(starttime).add(2, 'm'),
					//moment(starttime).add(30, 's'),
					false,
					2,
					false,
					false
				)
			);

			ac.push(
				//4te aktion
				//Condition Flagge gesetzt
				//3 minuten bis zum 1 min signal
				new actState(
					[res.flags.klass, res.flags[start.condition], {}, {}],
					[
						{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_down,
							flagPic: res.flags[start.condition],
						},
					],
					moment(starttime).add(5, 'm'),
					//moment(starttime).add(45, 's'),
					false,
					3,
					false,
					false
				)
			);

			ac.push(
				//5te aktion
				//1 minuten signal geschossen, condition flagge geborgen
				//1 minute bis start
				new actState(
					[res.flags.klass, {}, {}, {}],
					[
						{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_down,
							flagPic: res.flags.klass,
						},
					],
					moment(starttime).add(6, 'm'),
					//moment(starttime).add(60, 's'),
					false,
					4,
					false,
					false
				)
			);

			//nach dem start alle flaggen bergen und solange
			//kein button press keine nächsten aktionen
			ac.push(
				new actState(
					[{}, {}, {}, {}],
					[],
					moment(starttime)
						.add(6, 'm')
						.add(10, 's'),
					//moment(starttime).add(75, 's'),
					true,
					5,
					false,
					false
				)
			);

			ac.push(
				new actState(
					[{}, {}, {}, {}],
					[],
					moment(starttime)
						.add(6, 'm')
						.add(11, 's'),
					//moment(starttime).add(90, 's'),
					false,
					6,
					false,
					false
				)
			);
		});

		return ac;
	};

	setInitialFlags = () => {
		this.setState(this.actlist[0].getState());
	};

	setBadStart = (single, ARGcondition) => {
		//updateflags freischalten (wird blockiert, wenn ende der aktionen erreicht ist)
		this.setState({ startFinished: false });
		//rückrufbuttons deaktivieren
		this.setState({ viewBadStartBtns: false });
		//letzte startzeit
		let lastStartTime = moment(
			this.actlist[this.actlist.length - 1].getTime()
		).subtract(10, 's');
		//neue actions
		let bsacts = [];

		if (single) {
			//Einzelrückruf
			//bei einem Einzelrückruf wird die Flagge x gesetzt, bis die einzelrückrufer ihrer erneuten startpflicht nachgekommen sind
			//Sind die Teilnehmer ihrer pflicht nachgekommen wird ein button zur bestätigung gedrückt.
			bsacts.push(
				new actState(
					[res.flags.x, {}, {}, {}],
					[],
					moment(lastStartTime).add(4, 'm'),
					false,
					undefined,
					false,
					false
				)
			);

			//button zur bestätigung aktivieren
			this.setState({ singleBadStart: true });

			this.setState({ curflags: [res.flags.x, {}, {}, {}] });

			//TODO: blinkendes ding mit schuss bild drinnen, damit klar ist dass der Schuss JETZT abgegeben werden muss.

			this.actlist = this.actlist.concat(bsacts);
		} else {
			this.setState({ viewStartPicker: false });

			//[*]Alle folgenden rennen um ARG verzögern
			//Es werden die startzeiten der nachfolgenden starts nicht automatisch nach hinten verschoben!!
			//Daher braucht es eine Funktion die das erledigt
			this.updateRow(10);

			//Komplette startwiederholung
			//Bei einer kompletten startwiederholung wird ein neustart eingeschoben, die restlichen Klassen haben zu warten. Die Reihenfolge wird nicht verändert.
			bsacts = this.createStartStates([
				//TODO MOMENT VERKACKT FELIX FRAGEN
				{
					time: moment(lastStartTime).add(10, 'm'),
					condition: ARGcondition,
					badstart: true,
				},
			]);

			//durch das Updateflags direkt unter dem Funktionskopf wird der step auf 6/13/20... gesetzt
			//das entspricht der letzten aktion des vorherigen starts, also des deaktivieren der rückrufbuttons
			//der neue start wird in die liste eingeschoben
			this.actlist.splice(this.step + 2, 0, ...bsacts);
		}

		//Countdown überspringen
		this.updateFlags();
		this.updateFlags();
	};

	updateRow = time => {
		//Siehe 10 Zeilen oben [*]
		//Slice liefert nur den gewünschten Teil des arrays zurück.
		//+2 weil im Moment des Funktionsaufrufs der stepcounter bei 5 ist
		let altered = this.actlist.slice(this.step + 2, this.actlist.length);

		//Es muss beim constructor der actstates eine Funktion sein, die Moment-Elemente um X minuten nach hinten schiebt.
		altered.forEach(elem => {
			elem.addTime(time, 'm');
		});

		//Einfügen der veränderten Werte
		//splice(startINDEX, deletions in front, new elements)
		this.actlist.splice(this.step + 2, 7, ...altered);
	};

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		//Auffhören mit updaten wenn liste abgearbeitet
		if (this.step < this.actlist.length - 1) {
			this.setState({ startFinished: false });
			this.step++;
			this.setState(this.actlist[this.step].getState());

			//war aktuelles element ein start?
			//wenn ja fehlstartbuttons anzeigen
			this.setState({ viewBadStartBtns: this.actlist[this.step].wasStart() });
		} else {
			this.setState({ startFinished: true });
		}
	};

	postponeAP = () => {
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.ap, {}, {}, {}],
				[],
				moment().add(30, 's'),
				false,
				undefined,
				true,
				true
			)
		);

		//TODO: versichern, dass verschieben Buttons nicht während der startphase verfügbar sind.
		this.actlist.splice(this.step, 0, ...postActs);
		this.step--;
		this.updateFlags();
	};

	postponeAPH = () => {
		console.log('postponeAPH()');
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.apoh, {}, {}, {}],
				[],
				moment().add(5, 's'),
				false,
				undefined,
				true,
				true
			)
		);

		//TODO: versichern, dass verschieben Buttons nicht während der startphase verfügbar sind.
		this.actlist.splice(this.step, 0, ...postActs);
		this.step--;
		this.updateFlags();
	};

	postponeAPA = () => {
		console.log('postponeAPA()');
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.apoa, {}, {}, {}],
				[],
				moment().add(5, 's'),
				false,
				undefined,
				false,
				false
			)
		);

		this.actlist = postActs;
		this.step--;
		this.updateFlags();
	};

	renderStartPicker = () => {
		return (
			<View style={{ backgroundColor: 'red', opacity: 0.7 }}>
				<Text style={{ fontSize: 40, fontWeight: 'bold' }}>
					Choose the starting Flag:
				</Text>
				<View style={{ flexDirection: 'row' }}>
					<TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {
							this.setState({ viewStartPicker: false });
							this.setBadStart(false, 'i');
						}}
					>
						<Image source={res.flags.i.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {
							this.setState({ viewStartPicker: false });
							this.setBadStart(false, 'z');
						}}
					>
						<Image source={res.flags.z.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {
							this.setState({ viewStartPicker: false });
							this.setBadStart(false, 'black');
						}}
					>
						<Image source={res.flags.black.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {
							this.setState({ viewStartPicker: false });
							this.setBadStart(false, 'p');
						}}
					>
						<Image source={res.flags.p.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
				</View>
			</View>
		);
	};

	renderBadStartBtns = () => {
		return (
			<View style={{ flexDirection: 'row', backgroundColor: 'red' }}>
				<Button
					title="Single bad Start"
					color="#841584"
					onPress={() => {
						this.setState({ viewBadStartBtns: false });
						this.setBadStart(true);
					}}
					accessibilityLabel="Learn more about this purple button"
				/>
				<Button
					title="Massive Bad Start"
					color="#841520"
					onPress={() => {
						this.setState({ viewBadStartBtns: false });
						this.setState({ viewStartPicker: true });
					}}
					accessibilityLabel="Learn more about this purple button"
				/>
			</View>
		);
	};

	setDescription = text => {
		this.specialDescription = text;
	};

	makeSpecialDecision = () => {
		console.log('makeSpecialDecision');
		switch (this.state.specialChoice) {
			case 0:
				this.postponeAP();
				break;
			case 1:
				this.postponeAPH();
				break;
			case 2:
				this.postponeAPA();
				break;
			default:

			//WENN DA WAS IS IM ANDEREN ZWEIG MIT DEM HIER ÜBERSCHREIBEN
		}
	};

	renderMenu = () => {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: 'white',
					opacity: 0.7,
					flexDirection: 'row',
				}}
			>
				<View style={{ flex: 2, backgroundColor: 'lightgreen' }}>
					{this.specialBtnsDescs.map(args => {
						return (
							<TouchableOpacity
								onPress={() => {
									this.setState({ specialDescription: args.description });
									this.setState({ specialChoice: args.choice });
								}}
							>
								<Text style={{ fontSize: 40 }}>{args.button}</Text>
							</TouchableOpacity>
						);
					})}
					<TouchableOpacity
						onPress={() => {
							this.toggleModal();
							this.makeSpecialDecision();
						}}
					>
						<Text style={{ fontSize: 40 }}>Hide me!</Text>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 3, backgroundColor: 'lightblue' }}>
					<Text style={{ fontSize: 40 }}>{this.state.specialDescription}</Text>
				</View>
			</View>
		);
	};

	toggleModal = () =>
		this.setState({ isModalVisible: !this.state.isModalVisible });

	//Soll erst bei
	updateRowSpecial = time => {
		console.log('updateRowSpecial()');

		this.setState({ specialChoice: undefined });

		// console.log(this.step)
		// console.log(this.actlist)
		// console.log(this.actlist[this.step])
		// console.log('isSkippable ' + this.state.isSkippable)
		// console.log('isIndefinite ' + this.state.isIndefinite)

		this.actlist.splice(this.step, 1);

		// console.log(this.step)
		// console.log(this.actlist)
		// console.log(this.actlist[this.step])
		// console.log('isSkippable ' + this.state.isSkippable)
		// console.log('isIndefinite ' + this.state.isIndefinite)

		this.setState({ isSkippable: this.actlist[this.step].isSkippable });
		this.setState({ isIndefinite: this.actlist[this.step].isIndefinite });

		this.step--;
	};

	render = () => {
		console.log('indef?' + this.state.isIndefinite);
		console.log('skip?' + this.state.isSkippable);

		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					backgroundColor: '#fff',
				}}
			>
				{/* <FlagView flags={this.state.curFlags} /> */}
				<View style={{ flex: 3 }}>
					<Image
						source={require('./res/pics/ship.png')}
						style={styles.backgroundImage}
					>
						<View
							style={[
								styles.flagRow,
								{
									marginTop: '13.1%',
									marginLeft: '12.3%',
									marginRight: '25.6%',
								},
							]}
						>
							<FlagItem flag={this.state.curFlags.flag1} />
							<FlagItem flag={this.state.curFlags.flag2} />
						</View>
						<View
							style={[
								styles.flagRow,
								{
									marginTop: '7.7%',
									marginLeft: '19.4%',
									marginRight: '18.45%',
								},
							]}
						>
							<FlagItem flag={this.state.curFlags.flag3} />
							<FlagItem flag={this.state.curFlags.flag4} />
						</View>
						<View>
							<Button
								title="Special Actions"
								color="#845084"
								onPress={() => {
									this.toggleModal();
								}}
								accessibilityLabel="Learn more about this purple button"
							/>
							{this.state.viewBadStartBtns && this.renderBadStartBtns()}
							<Modal isVisible={this.state.isModalVisible}>
								{this.renderMenu()}
							</Modal>
							<Modal isVisible={this.state.viewStartPicker}>
								{this.renderStartPicker()}
							</Modal>
						</View>
					</Image>
				</View>

				<ActionView
					actions={this.state.curActions}
					countdownEndDate={this.state.countdownEndDate}
					onFinished={() => {
						console.log('onFinished()------------------');
						if (!this.state.startFinished) {
							if (this.state.specialChoice !== undefined) {
								switch (this.state.specialChoice) {
									case 0:
									case 1:
										this.updateRowSpecial(1);
										break;
								}
							}

							this.updateFlags();
						}
					}}
					isSkippable={this.state.isIndefinite}
					isIndefinite={this.state.isSkippable}
				/>
				{/* {this.state.viewStartPicker && this.renderStartPicker()} */}
			</View>
		);
	};
}

const styles = StyleSheet.create({
	flagRow: {
		flex: 0.25,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	backgroundImage: {
		flex: 1,
		height: undefined,
		width: undefined,
		resizeMode: 'cover',
	},
	spFlagImage: {
		flex: 1,
		alignSelf: 'stretch',
		height: undefined,
		width: undefined,
		resizeMode: 'contain',
	},
	spHighlight: {
		height: 200,
		width: 200,
		// flex: 1,
		//backgroundColor: 'red',
	},
});
