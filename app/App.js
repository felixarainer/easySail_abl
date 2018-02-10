// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions (TODO) / Count-
// 	down to children as props i.e. sets next state for the whole app ('Regelsys-
//	tem')
//:
// TODO: migrate Countdown logic here; UPDATE: not nessecary
// ?TODO?: Redux; UPDATE: not nessecary

import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Button,
	TouchableHighlight,
} from 'react-native';
import ActionView from './components/ActionView';
//import FlagView from './components/FlagView';
import FlagItem from './components/FlagItem';
import Orientation from 'react-native-orientation-locker';
import * as res from './res/res.js';
import moment from 'moment';

class actState {
	//isstart sagt aus, ob dieses ereignis in der Liste ein Startereignis ist
	constructor(flags, actions, time, isStart) {
		this.flags = flags;
		this.actions = actions;
		this.time = time;
		this.isStart = isStart;
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
		};
	};

	wasStart = () => {
		return this.isStart;
	};

	getTime = () => {
		return this.time;
	};

	addTime = time => {
		this.time = moment(this.time).add(time, 'm');
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
		};
		this.step = 0; //TODO(Reder): ordentlich implementieren (ggf. redux, keine ahnung wie gscheider)
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
					//TODO x durch fhs ersetzen
					[res.flags.x, {}, {}, {}],
					[
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_down,
							flagPic: res.flags.x,
						},
					],
					starttime,
					false
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
					false
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
					true
				)
			);

			ac.push(
				new actState(
					[{}, {}, {}, {}],
					[],
					moment(starttime)
						.add(6, 'm')
						.add(11, 's'),
					false
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
					false
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
			this.upddateRow(10);

			//Komplette startwiederholung
			//Bei einer kompletten startwiederholung wird ein neustart eingeschoben, die restlichen Klassen haben zu warten. Die Reihenfolge wird nicht verändert.
			bsacts = this.createStartStates(
				[
					//TODO MOMENT VERKACKT FELIX FRAGEN
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
	upddateRow = time => {
		console.log('updateRow()');
		//Slice liefert nur den gewünschten Teil des arrays zurück.
		//+2 weil im Moment des Funktionsaufrufs der stepcounter bei 5 ist
		let altered = this.actlist.slice(this.step + 2, this.actlist.length);

		//Es muss beim constructor der actstates eine Funktion sein, die Moment-Elemente um X minuten nach hinten schiebt.
		altered.forEach(elem => {
			elem.addTime(time);
		});
		console.log(altered);

		//Einfügen der veränderten Werte
		//splice(startINDEX, deletions in front, new elements)
		this.actlist.splice(this.step + 2, 7, ...altered);
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

	renderStartPicker = () => {
		return (
			<View style={{ backgroundColor: 'red' }}>
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
						{this.state.viewBadStartBtns && this.renderBadStartBtns()}
						{this.state.viewStartPicker && this.renderStartPicker()}
					</Image>
				</View>

				<ActionView
					actions={this.state.curActions}
					countdownEndDate={this.state.countdownEndDate}
					onFinished={() => {
						if (!this.state.startFinished) {
							this.updateFlags();
						}
					}}
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
