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
//import FlagView from './components/FlagView';
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
	constructor(flags, actions, time, isStart, rank, isSkippable, isIndef) {
		this.flags = flags;
		this.actions = actions;
		this.time = time;
		this.isStart = isStart;
		this.rank = rank;
		this.isSkippable = isSkippable;
		this.isIndef = isIndef;
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
			isIndef: this.isIndef,
			isSkippable: this.isSkippable,
		};
	};

	getRank = () => {
		return this.rank;
	}

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

	addTime = (time, type) => {
		this.time = moment(this.time).add(time, type);
	};

	subtractTime = (time, type) => {
		this.time = moment(this.time).subtract(time,type)
	}
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
			specialChoice: undefined,
			isSpecial: false,
			isIndef: false,
			isSkippable: false,
		};
		this.step = 0;

		this.specialBtnsDescs = [
			{key: 0, button: 'Verschieben (kurz)', description: 'Alle noch nicht gestarteten Renen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP". \nWenn Sie die Wettfahrt fortführen möchten klicken Sie auf den Countdown'},
			{key: 1,button: 'Verschieben (lang)', description: 'Alle noch nicht gestarteten Rennen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP" über der Flagge "H". \nWeitere Signale an Land geben.'},
			{key: 2,button: 'Verschieben und abbrechen', description: 'Alle noch nicht gestarteten Rennen werden verschoben. \nHeute findet keine Wettfahrt mehr statt. Bereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP" über der Flagge "A".'},
		];

	}

	componentWillMount() {
		this.actlist = this.createStartStates(
			[
				{
					time: moment().add(1, 'minutes'),
					condition: 'z',
				},
			],
			false
		);
		this.setInitialFlags();
	}

	createStartStates = (args, badstart) => {
		starttime = moment(args[0].time).subtract(6, 'minutes');

		let action1 = [];

		if (badstart) {
			action1.push(
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
					false,
				)
			);
		} else {
			action1.push(
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
					starttime,
					false,
					0,
					false,
					false,
				)
			);
		}

		let ac = [];

		args.forEach(start => {
			//2te aktion
			//l ist geborgen und in einer minute ankündigungssignal + Klassenflagge
			ac.push(
				new actState(
					[{}, {}, {}, {}],
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
					false,
					1,
					false,
					false,
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
							flagPic: res.flags[start.condition],
						},
					],
					moment(starttime).add(2, 'm'),
					false,
					2,
					false,
					false,
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
					false,
					3,
					false,
					false,
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
					false,
					4,
					false,
					false,
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
						.add(100, 's'),
					true,
					5,
					false,
					false,
				)
			);

			ac.push(
				new actState(
					[{}, {}, {}, {}],
					[],
					moment(starttime)
						.add(6, 'm')
						.add(100, 's'),
					false,
					6,
					false,
					false,
				)
			);
		});

		return action1.concat(ac);
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
			console.log('single bad start');
			//Einzelrückruf
			//bei einem Einzelrückruf wird die Flagge x gesetzt, bis die einzelrückrufer ihrer erneuten startpflicht nachgekommen sind
			//Sind die Teilnehmer ihrer pflicht nachgekommen wird ein button zur bestätigung gedrückt.
			bsacts.push(
				new actState(
					[res.flags.x, {}, {}, {}],
					[],
					moment(lastStartTime).add(4, 'm'),
					false,
					false,
					false,
				)
			);

			//button zur bestätigung aktivieren
			this.setState({ singleBadStart: true });

			this.setState({ curflags: [res.flags.x, {}, {}, {}] });

			//TODO: blinkendes ding mit schuss bild drinnen, damit klar ist dass der Schuss JETZT abgegeben werden muss.

			this.actlist = this.actlist.concat(bsacts);
		} else {
			console.log('massive bad start');

			this.setState({ viewStartPicker: false });

			//[*]Alle folgenden rennen um ARG verzögern
			//Es werden die startzeiten der nachfolgenden starts nicht automatisch nach hinten verschoben!!
			//Daher braucht es eine Funktion die das erledigt
			this.updateRow(10);

			//Komplette startwiederholung
			//Bei einer kompletten startwiederholung wird ein neustart eingeschoben, die restlichen Klassen haben zu warten. Die Reihenfolge wird nicht verändert.
			bsacts = this.createStartStates(
				[
					{
						time: moment(lastStartTime).add(10, 'm'),
						condition: ARGcondition,
					},
				],
				true
			);

			//durch das Updateflags direkt unter dem Funktionskopf wird der step auf 6/13/20... gesetzt
			//das entspricht der letzten aktion des vorherigen starts, also des deaktivieren der rückrufbuttons
			//der neue start wird in die liste eingeschoben
			this.actlist.splice(this.step + 2, 0, ...bsacts);
		}

		//Countdown überspringen
		this.updateFlags();
		this.updateFlags();
	};

	//Siehe 10 Zeilen oben [*]
	updateRow = arg => {
		console.log('updateRow()');
		//Slice liefert nur den gewünschten Teil des arrays zurück.
		//+2 weil im Moment des Funktionsaufrufs der stepcounter bei 5 ist
		let altered = this.actlist.slice(this.step + 2, this.actlist.length);

		//Es muss beim constructor der actstates eine Funktion sein, die Moment-Elemente um X minuten nach hinten schiebt.
		altered.forEach(elem => {
			elem.addTime(arg.time, 'minutes');
		});
		console.log(altered);

		//Einfügen der veränderten Werte
		//splice(startINDEX, deletions in front, new elements)
		this.actlist.splice(this.step + 2, altered.length, ...altered);
	};

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		console.log('updateflags()');
		//Auffhören mit updaten wenn liste abgearbeitet
		if (this.step < this.actlist.length - 1) {
			this.setState({ startFinished: false });
			this.step++;
			console.log(this.step - 1);
			console.log(this.actlist.length);
			console.log(this.actlist);
			this.setState(this.actlist[this.step].getState());

			//war aktuelles element ein start?
			//wenn ja fehlstartbuttons anzeigen
			this.setState({ viewBadStartBtns: this.actlist[this.step].wasStart() });
		} else {
			console.log('updateflags(): reached end of array');
			this.setState({ startFinished: true });
		}
	};

	postponeAP = () => {
		console.log('postponeAP()')
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.ap, {}, {}, {}],
				[],
				moment(),
				false,
				true,
				true,
			)
		);

		//Ob der aktuelle Start noch nicht fertig ist
		if(this.actlist[this.step].getRank()<5){
			console.log('1')
			//Boote sind noch nicht gestartet
			this.actlist.splice(this.step, 0, ...postActs);
			this.step--;
			this.updateFlags();
		}else{
			console.log('2')
			//Boote sind bereits gestartet
			if(this.actlist.length - this.step > 2){
				console.log('2.1')
				//Es wären nachher noch starts drinnen im Ablauf, das boot wird erst upgedated wenn die fehlstart ereignisse weg sind
				if(this.actlist[this.step].getRank() === 5){
					console.log('2.1.1')
					//rank 5
					this.actlist.splice(this.step+2, 0, ...postActs)
				}else{
					console.log('2.1.2')
					//rank 6
					this.actlist.splice(this.step+1, 0, ...postActs)
				}
			}else{
				console.log('2.2')
				//Es sind nachher keine Starts mehr drinnen.
				this.actlist.concat(...postActs);
			}
		}

		console.log(this.actlist);

		// this.actlist.splice(this.step, 0, ...postActs)
		// this.step--;
		// this.updateFlags();
	}

	//TODO: debuggen
	postponeAPH = () => {
		console.log('postponeAPH()')
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.apoh, {}, {}, {}],
				[],
				moment(),
				false,
				true,
				true,
			)
		);

		//Ob der aktuelle Start noch nicht fertig ist
		if(this.actlist[this.step].getRank()<5){
			//Boote sind noch nicht gestartet
			this.actlist.splice(this.step, 0, ...postActs);
			this.step--;
			this.updateFlags();
		}else{
			//Boote sind bereits gestartet
			if(this.actlist.length - this.step > 2){
				//Es wären nachher noch starts drinnen im Ablauf, das boot wird erst upgedated wenn die fehlstart ereignisse weg sind
				if(this.actlist[this.step].getRank() === 5){
					//rank 5
					this.actlist.splice(this.step+2, 0, ...postActs)
				}else{
					//rank 6
					this.actlist.splice(this.step+1, 0, ...postActs)
				}
			}else{
				//Es sind nachher keine Starts mehr drinnen.
				this.actlist.concat(...postActs);
			}
		}
	}

	postponeAPA = () => {
		console.log('postponeAPA()')
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.apoa, {}, {}, {}],
				[],
				moment(),
				false,
				true,
				true,
			)
		);

		this.actlist = postActs;
		this.step = -1;
		this.updateFlags();
	}

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
		console.log('makeSpecialDecision')
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

		}
	}

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
					{
						this.specialBtnsDescs.map(args => {
							return (<TouchableOpacity onPress={() => {
								this.setState({specialDescription: args.description})
								this.setState({specialChoice: args.key})
							}}>
								<Text style={{ fontSize: 40 }}>{args.button}</Text>
							</TouchableOpacity>)
						})
					}
					<TouchableOpacity onPress={() => {
						this.toggleModal();
						this.makeSpecialDecision();
					}}>
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

	updateRowSpecific = (time) => {

			//Removes current element which is the indefinite countdown which has to be skipped by user
			this.actlist.splice(this.step, 1);

			//Setting back this.step au elem 1/7 des startvorgangs setzen
			if((this.actlist[this.step].getRank() !== undefined)  || (this.actlist[this.step].getRank() < 5)){
				this.step -= this.actlist[this.step].getRank();
			}

			this.setState({specialChoice: undefined})

			//Teil der Liste, der verändert wird
			let altered = this.actlist.slice(this.step, this.actlist.length);

			//This.steps ist am Anfang des Startvorgangs, daher kann man direkt von hier die Zeit nehmen
			let oldTime = this.actlist[this.step].getTime();
			let newtime = moment().add(60,'seconds');

			let diff = newtime.diff(oldTime, 'seconds')

			if(diff < 0){
				diff *= -1;
				altered.forEach(elem => {
					return elem.subtractTime(diff, 'seconds');
				});
			}else{
				altered.forEach(elem => {
					return elem.addTime(diff, 'seconds');
				});
			}

			//Einfügen der veränderten Werte
			//splice(startINDEX, deletions in front, new elements)
			this.actlist.splice(this.step, altered.length, ...altered);

			this.step--;
	}

	render = () => {
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
						if (!this.state.startFinished) {
							if(this.state.specialChoice !== undefined){
								switch(this.state.specialChoice){
									case 0:
										this.updateRowSpecific(1);
										break;
								}
							}

							this.updateFlags();
						}
					}}
					isSkippable={true}
					isIndefinite={true}
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
