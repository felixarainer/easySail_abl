// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions () / Count-
// 	down to children as props i.e. sets next state for the whole app ('Regelsys-
//	tem')

//Alert.alert('Alert Title','My Alert Msg',[],{ cancelable: true })

import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Button,
	TouchableHighlight,
	TouchableOpacity,
	Alert,
} from 'react-native';
import ActionView from './ActionView';
import ActionItem from './ActionItem';
import FlagItem from './FlagItem';
import Orientation from 'react-native-orientation-locker';
import * as res from '../res/res.js';
import styles from '../styles.js';
import moment from 'moment';
import Modal from 'react-native-modal';
import { StackNavigator } from 'react-navigation';
//import { CheckBox } from 'react-native-elements';

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
			enableBadStartBtns: this.isStart,
			isIndefinite: this.isIndefinite,
			isSkippable: this.isSkippable,
		};
	};

	wasStart = () => {
		return this.isStart;
	};

	getFlags = () => {
		return this.flags;
	};

	setFlags = newFlags => {
		this.flags = newFlags;
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

	setTime = newTime => {
		this.time = newTime;
	};
}

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			curFlags: {},
			enableBadStartBtns: false,
			startFinished: false,
			isStartPickerVisible: false,
			isActionsMenuVisible: false,
			specialDescription: '',
			isSkippable: undefined,
			isIndefinite: undefined,
			postPoneBadStart: undefined,
			specialChoice: 99, //99 = orange flagge setzen beim start, wird normalerweise nur für die specialactions benutzt, ausnahme
			isSpecial: false,
			interval: 10,
			specialPics: [],
		};
		this.step = 0;

		this.flagSpot4 = {};

		this.specialBtnsDescs = [
			{
				key: 0,
				button: 'Verschieben (kurz)',
				specialpics: [res.actions.signal_2, res.actions.flag_up, res.flags.ap],
				description:
					'Alle noch nicht gestarteten Rennen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nWenn Sie die Wettfahrt(en) fortführen möchten klicken Sie auf den Countdown',
			},
			{
				key: 1,
				button: 'Verschieben (lang)',
				specialpics: [
					res.actions.signal_2,
					res.actions.flag_up,
					res.flags.apoh,
				],
				description:
					'Alle noch nicht gestarteten Rennen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nWeitere Signale an Land geben.\nWenn Sie die Wettfahrt(en) fortführen möchten klicken Sie auf den Countdown',
			},
			{
				key: 2,
				button: 'Verschieben und abbrechen',
				specialpics: [
					res.actions.signal_2,
					res.actions.flag_up,
					res.flags.apoa,
				],
				description:
					'Alle noch nicht gestarteten Rennen werden verschoben. \nHeute findet keine Wettfahrt mehr statt. Bereits gestartete Rennen werden weiter gesegelt.',
			},
			{
				key: 3,
				button: 'Abbrechen (rasche WH)',
				specialpics: [res.actions.signal_3, res.actions.flag_up, res.flags.n],
				description:
					'Alle bereits gestarteten Rennen werden abgebrochen \nAlle Boote kehren zum Startgebiet zurück \nWenn Sie die Wettfahrt(en) erneut starten möchten, klicken Sie auf den Countdown',
			},
			{
				key: 4,
				button: 'Abbrechen (spätere WH)',
				specialpics: [res.actions.signal_3, res.actions.flag_up, res.flags.noh],
				description:
					'Alle bereits gestarteten Rennen werden abgebrochen \nWeitere Signale an Land geben.\nWenn Sie die Wettfahrt(en) erneut starten möchten, klicken Sie auf den Countdown',
			},
			{
				key: 5,
				button: 'Regatta Abbrechen',
				specialpics: [res.actions.signal_3, res.actions.flag_up, res.flags.noa],
				description:
					'Alle bereits gestarteten Rennen werden abgebrochen \nHeute findet keine Wettfahrt mehr statt.',
			},
			{
				key: 6,
				button: 'Schwimmwesten anlegen (Aufruf)',
				specialpics: [res.actions.signal_1, res.actions.flag_up, res.flags.y],
				description: 'Setzen der Flagge "Y"',
			},
		];
	}

	static navigationOptions = {
		header: null,
	};

	//componentwillmount wird NACH dem constructor aufgerufen...
	componentWillMount() {
		console.log('componentWillMount();');
		let start = 11;

		this.actlist = this.createStartStates([
			{
				time: moment().add(start, 'minutes'),
				condition: 'i',
				badstart: false,
				first: true,
			},
			{
				time: moment().add(start + this.state.interval, 'minutes'),
				condition: 'p',
				badstart: false,
				first: false,
			},
		]);

		console.log(this.actlist);

		this.setInitialFlags();
	}

	createStartStates = args => {
		let ac = [];

		args.forEach(start => {
			let starttime = moment(start.time).subtract(5, 'minutes');

			//1ste aktion
			if (start.badstart) {
				console.log('createBadStart()');
				ac.push(
					new actState(
						[res.flags.orange, res.flags.fhs, {}, this.flagSpot4],
						[
							{
								name: 'TestAction2',
								actionPic: res.actions.flag_down,
								flagPic: res.flags.fhs,
							},
						],
						starttime,
						false,
						0,
						true,
						true
					)
				);
			} else {
				//worange flagge muss nur gesetzt werden, wenn startanfang
				if (start.first) {
					console.log('createFirstStart()');

					ac.push(
						new actState(
							[{}, {}, {}, this.flagSpot4],
							[
								{
									name: 'TestAction2',
									actionPic: res.actions.flag_up,
									flagPic: res.flags.orange,
								},
							],
							//effektiv 10 minuten vor tatsächlichem ersten start.
							moment(starttime).subtract(5, 'minutes'),
							false,
							0,
							true,
							true
						)
					);
				} else {
					console.log('createStart()');

					ac.push(
						new actState(
							[res.flags.orange, {}, {}, this.flagSpot4],
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
							starttime,
							false,
							0,
							// false,
							// false,
							true,
							true,
						)
					);
				}
			}

			//2te aktion
			//l ist geborgen und in einer minute ankündigungssignal + Klassenflagge
			ac.push(
				new actState(
					[res.flags.orange, {}, {}, this.flagSpot4],
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
					starttime,
					false,
					1,
					// false,
					// false,
					true,
					true,
				)
			);

			ac.push(
				//this.setp = 2
				//3te aktion
				//Klassenflagge gesetzt
				//in einer minute Vorbereitungssignal und Startmethode
				new actState(
					[res.flags.orange, res.flags.klass, {}, this.flagSpot4],
					[
						{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_up,
							flagPic: res.flags[start.condition],
						},
					],
					moment(starttime).add(1, 'm'),
					false,
					2,
					// false,
					// false,
					true,
					true,
				)
			);

			ac.push(
				//4te aktion
				//Condition Flagge gesetzt
				//3 minuten bis zum 1 min signal
				new actState(
					[
						res.flags.orange,
						res.flags.klass,
						res.flags[start.condition],
						this.flagSpot4,
					],
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
					moment(starttime).add(4, 'm'),
					false,
					3,
					// false,
					// false,
					true,
					true,
				)
			);

			ac.push(
				//5te aktion
				//1 minuten signal geschossen, condition flagge geborgen
				//1 minute bis start
				new actState(
					[res.flags.orange, res.flags.klass, {}, this.flagSpot4],
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
					moment(starttime).add(5, 'm'),
					false,
					4,
					// false,
					// false,
					true,
					true,
				)
			);

			//nach dem start alle flaggen bergen und solange
			//kein button press keine nächsten aktionen
			ac.push(
				new actState(
					[res.flags.orange, {}, {}, this.flagSpot4],
					[],
					moment(starttime)
						.add(5, 'm')
						.add(10, 's'),
					true,
					5,
					// false,
					// false,
					true,
					true,
				)
			);

			ac.push(
				new actState(
					[res.flags.orange, {}, {}, this.flagSpot4],
					[],
					moment(starttime)
						.add(5, 'm')
						.add(11, 's'),
					false,
					6,
					// false,
					// false,
					true,
					true,
				)
			);
		});

		return ac;
	};

	setInitialFlags = () => {
		this.setState(this.actlist[0].getState());
	};

	singleBadStart = () => {
		//Einzelrückruf
		//bei einem Einzelrückruf wird die Flagge x gesetzt, bis die einzelrückrufer ihrer erneuten startpflicht nachgekommen sind
		//Sind die Teilnehmer ihrer pflicht nachgekommen wird ein button zur bestätigung gedrückt.

		console.log('singlebadStart()');

		//updateflags freischalten (wird blockiert, wenn ende der aktionen erreicht ist)
		this.setState({ startFinished: false });
		//rückrufbuttons deaktivieren
		this.setState({ enableBadStartBtns: false });

		//Die Teilnehmer haben 4 Minuten Zeit zurückzukehren, derweil wird das restliche Feld angehalten, damit keine Verwirrung entsteht.
		//Das restliche Feld wird nur wenn nötig angehalten.
		if (this.state.interval < 10) {
			this.setState({ specialChoice: 97 });
		}

		//neue actions
		let bsacts = [];

		bsacts.push(
			new actState(
				[res.flags.orange, res.flags.x, {}, this.flagSpot4],
				[
					{
						name: 'TestAction2',
						actionPic: res.actions.flag_down,
						flagPic: res.flags.x,
					},
				],
				//4 minuten werden hier eingefügt, da nächstes ankündigungssignal noch nicht gegeben
				moment().add(4, 'm'),
				false,
				undefined,
				false,
				false
			)
		);

		this.actlist.splice(this.step + 1, 0, ...bsacts);
		this.updateFlags();
		this.actlist.splice(this.step, 1);
	};

	massiveBadStart = ARGcondition => {
		//updateflags freischalten (wird blockiert, wenn ende der aktionen erreicht ist)
		this.setState({ startFinished: false });
		//rückrufbuttons deaktivieren
		this.setState({ enableBadStartBtns: false });

		this.setState({ isStartPickerVisible: false });
		//neue actions
		let bsacts = [];
		let badstart = true;

		console.log('massive bad start()');

		let mom = moment();
		let toRank = this.step + 7;

		//postponebadstart wird nur ausgeführt wenn danach noch ein start kommt
		if (this.state.postPoneBadStart && this.actlist.length - this.step > 5) {
			rank = this.actlist[this.step].getRank();
			switch (rank) {
				case 6:
					mom = moment(this.actlist[this.step - 2].getTime());
					toRank += 1;
					break;
				case 5:
					mom = moment(this.actlist[this.step - 1].getTime());
					toRank += 2;
					break;
				case 4:
					mom = moment(this.actlist[this.step].getTime());
					toRank += 3;
					break;
				case 0:
					mom = moment(this.actlist[this.step - 3].getTime());
					toRank += 0;
					break;
				case 1:
					mom = moment(this.actlist[this.step - 4].getTime());
					toRank -= 1;
					break;
			}

			mom = mom.add(this.state.interval, 'minutes');
			mom = mom.add(this.state.interval, 'minutes');

			badstart = false;
		} else {
			//SppecialChoice 98: 1fhs
			this.setState({ specialChoice: 98 });
		}

		bsacts = this.createStartStates([
			{
				time: mom,
				condition: ARGcondition,
				badstart: badstart,
				first: false,
			},
		]);

		let rank = this.actlist[this.step].getRank();
		let pos = undefined;

		//richtiges einfügen in die pipeline
		//postponebadstart wird nur ausgeführt, wenn danach noch ein start kommt.
		if (this.state.postPoneBadStart && this.actlist.length - this.step > 5) {
			if (this.actlist[this.step].getRank() > 4) {
				pos = this.step - rank + 14;
				this.actlist.splice(pos, 0, ...bsacts);
				this.step += 6 - rank;
			} else {
				pos = this.step - rank + 7;
				this.actlist.splice(pos, 0, ...bsacts);
				this.step -= rank + 1;
			}
		} else {
			//KEIN ZEITUPDATE BEI SOFORTIGEM NEUSTART; WIRD GEMACHT WENN COUNTDOWN überrsprungen wird
			if (this.actlist[this.step].getRank() > 4) {
				pos = this.step - rank + 7;
				this.actlist.splice(pos, 0, ...bsacts);
				this.step += 6 - rank;
			} else {
				pos = this.step - rank;
				this.actlist.splice(pos, 0, ...bsacts);
				this.step -= rank + 1;
			}
		}
		this.setState({ postPoneBadStart: false });
		this.setState({ specialChoice: undefined });
		this.updateFlags();
	};

	updateRowByTime = (time, unit, startStep) => {
		console.log('updateRowByTime()');
		//Alles um <time> <unit> verschieben. Ab startstep in der pipeline

		//Slice liefert nur den gewünschten Teil des arrays zurück.
		//+2 weil im Moment des Funktionsaufrufs der stepcounter bei 5 ist
		let altered = this.actlist.slice(startStep, this.actlist.length);

		//Es muss beim constructor der actstates eine Funktion sein, die Moment-Elemente um X minuten nach hinten schiebt.
		altered.forEach(elem => {
			elem.addTime(time, unit);
		});

		this.setState({ specialChoice: undefined });

		//Einfügen der veränderten Werte
		//splice(startINDEX, deletions in front, new elements)
		this.actlist.splice(startStep, altered.length, ...altered);
	};

	updateRowToTime = (time, unit, startStep) => {
		console.log('updateRowToTime()');
		let newTime = moment().add(time, unit);
		let oldTime = this.actlist[startStep].getTime();
		let diff = newTime.diff(oldTime, 's');
		this.updateRowByTime(diff, 's', startStep);
	};

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	dropOrangeFlag = () => {
		console.log('dropOrangeFlag()');
		let swapStates = [];

		let oldFlags = this.actlist[this.actlist.length - 1].getFlags();
		let oldTime = this.actlist[this.actlist.length - 1].getTime();
		let oldStart = this.actlist[this.actlist.length - 1].wasStart();

		swapStates.push(
			new actState(
				oldFlags,
				[
					{
						name: 'TestAction2',
						actionPic: res.actions.flag_down,
						flagPic: res.flags.orange,
					},
				],
				oldTime,
				oldStart,
				true,
				true
			)
		);

		this.actlist.splice(this.actlist.length - 1, 1, ...swapStates);
	};

	updateFlags = () => {
		//Auffhören mit updaten wenn liste abgearbeitet
		if (this.step < this.actlist.length - 1) {
			this.setState({ startFinished: false });
			this.step++;
			console.log('updateFlags-beforeSetState');
			console.log(this.step);
			console.log(this.actlist.length);
			console.log(this.actlist);
			console.log(this.actlist[this.step].getState());
			this.setState(this.actlist[this.step].getState());
			console.log('updateFlags-afterSetState');
			if (this.step === this.actlist.length - 3) {
				this.dropOrangeFlag();
			}
		} else {
			const { state, navigate } = this.props.navigation;
			this.setState({startFinished: true})
			navigate('Timing');
		}
	};

	postponeAP = () => {
		console.log('postPoneAP');
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.orange, res.flags.ap, {}, this.flagSpot4],
				[],
				moment(),
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
				[{}, res.flags.apoh, {}, this.flagSpot4],
				[],
				moment(),
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
				[{}, res.flags.apoa, {}, this.flagSpot4],
				[],
				moment(),
				false,
				undefined,
				false,
				false
			)
		);

		this.actlist = postActs;
		this.step = -1;
		this.updateFlags();
	};

	cancelN = () => {
		console.log('cancel_N');
		let cancelActs = [];
		let newTime = 0;

		cancelActs.push(
			new actState(
				[res.flags.orange, res.flags.n, {}, this.flagSpot4],
				[],
				moment(),
				false,
				undefined,
				true,
				true
			)
		);

		this.actlist.splice(0, 0, ...cancelActs);
		this.step = -1;
		this.updateFlags();
	};

	cancelNH = () => {
		console.log('cancel_NOH');
		let cancelActs = [];
		let newTime = 0;

		cancelActs.push(
			new actState(
				[{}, res.flags.noh, {}, this.flagSpot4],
				[],
				moment(),
				false,
				undefined,
				true,
				true
			)
		);

		this.actlist.splice(0, 0, ...cancelActs);
		this.step = -1;
		this.updateFlags();
	};

	cancelNA = () => {
		console.log('cancel_NOA()');
		let cancelActs = [];
		let newTime = 0;

		cancelActs.push(
			new actState(
				[{}, res.flags.noa, {}, this.flagSpot4],
				[],
				moment(),
				false,
				undefined,
				false,
				false
			)
		);

		this.actlist = cancelActs;
		this.step = -1;
		this.updateFlags();
	};

	handleFlagY = () => {
		console.log('handleFlagY()');

		let newFlag = undefined;

		if (this.flagSpot4 !== res.flags.y) {
			console.log('!== Y');
			newFlag = res.flags.y;
			this.specialBtnsDescs[6] = {
				key: 6,
				button: 'Schwimmwesten ablegen',
				description: 'Bergen der Flagge "Y"',
			};
		} else {
			console.log('=== Y');
			newFlag = {};
			this.specialBtnsDescs[6] = {
				key: 6,
				button: 'Schwimmwesten anlegen (Aufruf)',
				description: 'Setzen der Flagge "Y"',
			};
		}

		this.flagSpot4 = newFlag;

		this.actlist.forEach(elem => {
			let flags = elem.getFlags();
			flags[3] = newFlag;
			elem.setFlags(flags);
		});

		this.step--;
		this.updateFlags();
	};

	renderStartPicker = () => {
		console.log('renderStartPicker()');
		let startFlags = [res.flags.i, res.flags.z, res.flags.black, res.flags.p];
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
						Wählen sie eine Flagge aus:{' '}
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
					<TouchableHighlight
						style={[
							styles.buttonHighlight,
							{ flex: 1.5 },
							this.state.postPoneBadStart
								? styles.toggleButton
								: styles.buttonDisabled,
						]}
						//underlayColor="blue"
						onPress={() => {
							this.togglePostPone();
						}}
					>
						<Text style={styles.buttonLabel}>
							Fehlstart verschieben:{' '}
							{this.state.postPoneBadStart ? 'aktiviert' : 'deaktiviert'}
						</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={[styles.buttonHighlight, styles.okButton]}
						underlayColor="#26de81"
						onPress={() => {
							this.toggleStartPicker();
							this.massiveBadStart(this.state.badStartCondition);
						}}
					>
						<Text style={styles.buttonLabel}>Bestätigen</Text>
					</TouchableHighlight>
				</View>
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
			case 3:
				this.cancelN();
				break;
			case 4:
				this.cancelNH();
				break;
			case 5:
				this.cancelNA();
				break;
			case 6:
				this.handleFlagY();
				break;
			default:
				//weis nicht warum notwendig, einfach if wegtun wenn interessiert.
				if (this.step !== 0) {
					this.setState({ specialChoice: undefined });
				}
		}
	};

	renderMenu = () => {
		console.log('renderMenu();');
		return (
			<View
				style={[
					{
						flex: 1,
						flexDirection: 'row',
					},
					styles.menuBackground,
				]}
			>
				<View style={{ flex: 1 }}>
					{this.specialBtnsDescs.map(args => {
						return (
							<TouchableHighlight
								key={args.key}
								style={[
									styles.listEntryHighlight,
									this.state.specialKey === args.key &&
										styles.listEntrySelected,
								]}
								underlayColor="#0fb9b1"
								onPress={() => {
									this.setState({ specialDescription: args.description });
									this.setState({ specialKey: args.key });
									this.setState({ specialPics: args.specialpics });
								}}
							>
								<Text style={styles.listEntryText}>{args.button}</Text>
							</TouchableHighlight>
						);
					})}
				</View>
				<View
					style={[
						{
							flex: 3,
							flexDirection: 'column',
						},
					]}
				>
					<View style={{ flex: 3 }}>
						<Text style={styles.descriptionText}>
							<Text style={{ fontWeight: 'bold' }}>{'Beschreibung: '}</Text>
							{this.state.specialDescription}
						</Text>
					</View>
					<View style={{ flex: 2.2, flexDirection: 'row' }}>
						<View style={{ flex: 0.5 }}>
							<Text style={[styles.descriptionText, { fontWeight: 'bold' }]}>
								Nächste Aktionen:
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<ActionItem
								style={styles.actionMenuItem}
								item={{ actionPic: this.state.specialPics[0] }}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<ActionItem
								style={styles.actionMenuItem}
								item={{
									actionPic: this.state.specialPics[1],
									flagPic: this.state.specialPics[2],
								}}
							/>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<TouchableHighlight
							style={[styles.buttonHighlight, styles.cancelButton]}
							underlayColor="red"
							onPress={() => {
								this.toggleModal();
							}}
						>
							<Text style={styles.buttonLabel}>Abbrechen</Text>
						</TouchableHighlight>
						<TouchableHighlight
							style={[styles.buttonHighlight, styles.okButton]}
							underlayColor="green"
							onPress={() => {
								this.toggleModal();
								this.makeSpecialDecision();
							}}
						>
							<Text style={styles.buttonLabel}>Bestätigen</Text>
						</TouchableHighlight>
					</View>
				</View>
			</View>
		);
	};

	toggleModal = () =>
		this.setState({ isActionsMenuVisible: !this.state.isActionsMenuVisible });

	toggleStartPicker = () => {
		this.setState({ isStartPickerVisible: !this.state.isStartPickerVisible });
	};

	toggleStartButtons = () => {
		this.setState({ enableBadStartBtns: !this.state.enableBadStartBtns });
	};

	togglePostPone = () => {
		this.setState({ postPoneBadStart: !this.state.postPoneBadStart });
	};

	render = () => {
		console.log('render();');
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
				}}
			>
				<View style={{ flex: 3, flexDirection: 'column' }}>
					<View
						style={{
							flex: 3,
							backgroundColor: '#d1d8e0',
							padding: 20,
							paddingBottom: 0,
							flexDirection: 'column',
						}}
					>
						<View style={styles.flagRow}>
							<View style={styles.flagContainer}>
								<Image
									style={styles.flagImage}
									source={this.state.curFlags.flag1.pic}
								/>
							</View>
							<View style={styles.flagContainer}>
								<Image
									style={styles.flagImage}
									source={this.state.curFlags.flag2.pic}
								/>
							</View>
						</View>
						<View style={styles.flagRow}>
							<View style={styles.flagContainer}>
								<Image
									style={styles.flagImage}
									source={this.state.curFlags.flag3.pic}
								/>
							</View>
							<View style={styles.flagContainer}>
								<Image
									style={styles.flagImage}
									source={this.state.curFlags.flag4.pic}
								/>
							</View>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<TouchableHighlight
							style={[styles.buttonHighlight, { backgroundColor: '#4b7bec' }]}
							underlayColor={'#3867d6'}
							onPress={() => this.toggleModal()}
						>
							<Text style={styles.buttonLabel}>Aktion initiieren</Text>
						</TouchableHighlight>
						<TouchableHighlight
							style={[
								styles.buttonHighlight,
								this.state.enableBadStartBtns
									? { backgroundColor: '#45aaf2' }
									: styles.buttonDisabled,
							]}
							underlayColor={'#2d98da'}
							onPress={() => {
								if (this.state.enableBadStartBtns) {
									this.toggleStartButtons();
									this.singleBadStart();
								} //TODO change back
							}}
						>
							<Text style={styles.buttonLabel}>Einzelrückruf</Text>
						</TouchableHighlight>
						<TouchableHighlight
							style={[
								styles.buttonHighlight,
								this.state.enableBadStartBtns
									? { backgroundColor: '#2bcbba' }
									: styles.buttonDisabled,
							]}
							underlayColor={'#0fb9b1'}
							onPress={() => {
								if (this.state.enableBadStartBtns) {
									this.toggleStartButtons();
									this.toggleStartPicker();
								}
							}}
						>
							<Text style={styles.buttonLabel}>Allgemeiner Rückruf</Text>
						</TouchableHighlight>
						<Modal isVisible={this.state.isActionsMenuVisible}>
							{this.renderMenu()}
						</Modal>
						<Modal isVisible={this.state.isStartPickerVisible}>
							{this.renderStartPicker()}
						</Modal>
					</View>
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
									case 3:
									case 4:
									case 97:
									case 98:
										this.updateRowToTime(1, 'm', this.step + 1);
										break;
									case 99:
										this.updateRowToTime(5, 'm', this.step + 1);
										break;
								}
							}

							this.updateFlags();
						}
					}}
					isSkippable={this.state.isIndefinite}
					isIndefinite={this.state.isSkippable}
				/>
			</View>
		);
	};
}
