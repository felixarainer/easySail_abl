// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions (TODO) / Count-
// 	down to children as props i.e. sets next state for the whole app ('Regelsys-
//	tem')
//:
// TODO: migrate Countdown logic here
// ?TODO?: Redux

import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import ActionView from './components/ActionView';
import FlagView from './components/FlagView';
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
}

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			curFlags: {},
			buttons: false,
			startFinished: false,
		};
		this.step = 0; //TODO(Reder): ordentlich implementieren (ggf. redux, keine ahnung wie gscheider)
	}

	componentWillMount() {
		this.actlist = this.createStartStates(
			[
				{
					time: moment().add(20, 'seconds'), //moment('16:34', 'HH:mm'), for testing purposes
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
							flagPic: res.flags.fhs,
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
							//TODO damir fragen wegen res.flags.{start.condition}
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
							//TODO damir fragen wegen res.flags.{start.condition}
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
						.add(10, 's'),
					false
				)
			);
		});

		return action1.concat(ac);
	};

	setInitialFlags = () => {
		this.setState(this.actlist[0].getState());
	};

	setBadStart = single => {
		//updateflags freischalten (wird blockiert, wenn ende der aktionen erreicht ist)
		this.setState({ startFinished: false });

		//rückrufbuttons deaktivieren
		this.setState({ buttons: false });
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
					//TODO: leeres objekt, da keine zeit erforderlich, da direkter neustart
					moment(lastStartTime).add(4, 'm'),
					false
				)
			);

			//button zur bestätigung aktivieren
			this.setState({ singleBadStart: true });

			//TODO: möglichkeit finden flaggen sofort zu ändern
			this.setState({ curflags: [res.flags.x, {}, {}, {}] });

			//TODO: blinkendes ding mit schuss bild drinnen, damit klar ist dass der Schuss JETZT abgegeben werden muss.
		}

		/*else{
			//Komplette startwiederholung
			//Bei einer kompletten startwiderholung wird zuerst die Regatta regelmäßig abgehalten und die erneut zu startende Klasse wird 10 minuten nach dem letzten regulären start gestartet
			//TODO: Condition abfragen
			let badstartList = this.createStartStates(
				[
					{time: moment(lastStartTime).add(10,'m'),
					condition: 'z'},
				],true
			);
		}*/

		this.actlist = this.actlist.concat(bsacts);

		this.updateFlags();
	};

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		console.log('fsjal App.updateFlags');
		//Auffhören mit updaten wenn liste abgearbeitet
		if (this.step < this.actlist.length - 1) {
			this.step++;
			this.setState(this.actlist[this.step].getState());

			//war aktuelles element ein start?
			//wenn ja fehlstartbuttons anzeigen
			this.setState({ buttons: this.actlist[this.step].wasStart() });
		} else {
			this.setState({ startFinished: true });
		}
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
				<FlagView flags={this.state.curFlags} />
				<ActionView
					actions={this.state.curActions}
					countdownEndDate={this.state.countdownEndDate}
					onFinished={() => {
						if (!this.state.startFinished) {
							this.updateFlags();
						}
					}}
				/>

				{this.state.buttons && (
					<Button
						title="Single bad Start"
						color="#841584"
						onPress={() => {
							this.setBadStart(true);
						}}
						style={{
							position: 'absolute',
							marginTop: '13.1%',
							marginLeft: '12.3%',
							marginRight: '25.6%',
						}}
						accessibilityLabel="Learn more about this purple button"
					/>
				)}
				{this.state.buttons && (
					<Button
						title="Massive Bad Start"
						color="#841584"
						onPress={() => {
							this.setBadStart(false);
						}}
						style={{
							position: 'absolute',
							marginTop: '13.1%',
							marginLeft: '12.3%',
							marginRight: '25.6%',
						}}
						accessibilityLabel="Learn more about this purple button"
					/>
				)}
			</View>
		);
	};
}
