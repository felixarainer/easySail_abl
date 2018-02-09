// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions (TODO) / Count-
// 	down to children as props i.e. sets next state for the whole app ('Regelsys-
//	tem')
//:
// TODO: migrate Countdown logic here
// ?TODO?: Redux

import React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableHighlight } from 'react-native';
import ActionView from './components/ActionView';
import FlagView from './components/FlagView';
import Orientation from 'react-native-orientation-locker';
import * as res from './res/res.js';
import moment from 'moment';

class actState{
	//isstart sagt aus, ob dieses ereignis in der Liste ein Startereignis ist
	constructor(flags,actions,time,isStart,isBadStart){
		this.flags = flags;
		this.actions = actions;
		this.time = time;
		this.isStart = isStart;
		this.isBadStart = isBadStart;
	}

	getState = ()=>{
		return {
			curFlags: {
				flag1: this.flags[0],
				flag2: this.flags[1],
				flag3: this.flags[2],
				flag4: this.flags[3],
			},
			curActions: this.actions,
			countdownEndDate: typeof(this.time) === 'number' ? moment().add(this.time, 'seconds') : this.time,
		}
	}

	wasStart = () =>{
		return this.isStart;
	}

	wasBadStart = () => {
		return this.isBadStart;
	}

	getTime = () => {
		return this.time;
	}

	addTime = (time) => {
		this.time = moment(this.time).add(time,'m');
	}
}

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			curFlags: {},
			buttons: false,
			startFinished: false,
			picker: false,
		};
		this.step = 0; //TODO(Reder): ordentlich implementieren (ggf. redux, keine ahnung wie gscheider)
	}

	componentWillMount() {
		this.actlist = this.createStartStates(
			[
				{time: moment('10:03','HH:mm'),
				 condition: 'z' },
		],false);
		this.setInitialFlags();

		console.log(this.actlist.length)

		//
	}

	createStartStates = (args,badstart) => {
		starttime = moment(args[0].time).subtract(6,'minutes');

		let action1 = [];

		//this.setp = 0
		if(badstart){
			action1.push(
				new actState(
					//TODO x durch fhs ersetzen
					[res.flags[start.condition],{},{},{}],
					[{
						name: 'TestAction2',
						actionPic: res.actions.flag_down,
						flagPic: res.flags.x,
					}],
					starttime,
					false,
					false
				)

			)
		}else{
			action1.push(
				//flagge l setzen und 6 min vor Start bergen
				new actState(
					[res.flags.l,{},{},{}],
					[{
						name: 'TestAction2',
						actionPic: res.actions.flag_down,
						flagPic: res.flags.l,
					}],
					starttime,
					false,
					false
			));
		}

		let ac = []

		args.forEach(start => {
			//this.setp = 1
			//2te aktion
			//l ist geborgen und in einer minute ankündigungssignal + Klassenflagge
			ac.push(new actState(
					[{},{},{},{}],
					[{
						name: 'TestAction1',
						actionPic: res.actions.signal_1,
						flagPic: undefined,
					},
					{
						name: 'TestAction2',
						actionPic: res.actions.flag_up,
						flagPic: res.flags.klass,
					}],
					moment(starttime).add(1,'m'),
					false,
					false
			))

			ac.push(
				//this.setp = 2
				//3te aktion
				//Klassenflagge gesetzt
				//in einer minute Vorbereitungssignal und Startmethode
					new actState(
							[res.flags.klass,{},{},{}],
							[{
								name: 'TestAction1',
								actionPic: res.actions.signal_1,
								flagPic: undefined,
							},
							{
								name: 'TestAction2',
								actionPic: res.actions.flag_up,
								//TODO damir fragen wegen res.flags.{start.condition}
								flagPic: res.flags[start.condition],
							}],
							moment(starttime).add(2,'m'),
							false,
							false
				))

				ac.push(
				//this.setp = 3
				//4te aktion
				//Condition Flagge gesetzt
				//3 minuten bis zum 1 min signal
				new actState(
						[res.flags.klass,res.flags[start.condition],{},{}],
						[{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_down,
							flagPic: res.flags[start.condition],
						}],
						moment(starttime).add(5,'m'),
						false,
						false
				))

				ac.push(
				//this.setp = 4
				//5te aktion
				//1 minuten signal geschossen, condition flagge geborgen
				//1 minute bis start
				new actState(
						[res.flags.klass,{},{},{}],
						[{
							name: 'TestAction1',
							actionPic: res.actions.signal_1,
							flagPic: undefined,
						},
						{
							name: 'TestAction2',
							actionPic: res.actions.flag_down,
							flagPic: res.flags.klass,
						}],
						moment(starttime).add(6,'m'),
						false,
						false
				))

				//this.setp = 5
				//nach dem start alle flaggen bergen und solange
				//kein button press keine nächsten aktionen
				//true aktiviert die buttons und der Countdown bleibt 10s sichtbar
				ac.push(new actState(
					[{},{},{},{}],
					[],
					moment(starttime).add(6,'m').add(10,'s'),
					true,
					false
				))

				//this.step = 6
				//false deaktiviert die buttons wieder, da countdown gleich mit vorherigem countdown, ist es gleichzeitig....
				ac.push(new actState(
					[{},{},{},{}],
					[],
					moment(starttime).add(6,'m').add(11,'s'),
					false,
					false
				))
		})

		return action1.concat(ac)
	}

	setInitialFlags = () => {
		this.setState(this.actlist[0].getState());
	};

	setBadStart = (single,ARGcondition) => {

		console.log('setbadstart()' + this.step);
		console.log('setbadstart()' + this.actlist.length);
		console.log('setbadstart()' + single);

		//updateflags freischalten (wird blockiert, wenn ende der aktionen erreicht ist)
		this.setState({startFinished: false})

		//rückrufbuttons deaktivieren
		this.setState({buttons: false});
		//letzte startzeit
		let lastStartTime = moment(this.actlist[this.actlist.length-1].getTime()).subtract(10,'s');
		//neue actions
		let bsacts = []


		console.log(this.actlist);

		if(single){
			console.log('single bad start');

			//Einzelrückruf
			//bei einem Einzelrückruf wird die Flagge x gesetzt, bis die einzelrückrufer ihrer erneuten startpflicht nachgekommen sind
			//Sind die Teilnehmer ihrer pflicht nachgekommen wird ein button zur bestätigung gedrückt.
			bsacts.push(new actState(
				[res.flags.x,{},{},{}],
				[],
				moment(lastStartTime).add(4,'m'),
				false
			))

			//button zur bestätigung aktivieren
			this.setState({singleBadStart: true})

			this.setState({curflags: [res.flags.x,{},{},{}]});

			//TODO: blinkendes ding mit schuss bild drinnen, damit klar ist dass der Schuss JETZT abgegeben werden muss.

			this.actlist = this.actlist.concat(bsacts);
		}
		else
		{
			console.log('massive bad start');

			this.setState({picker: false})

			//[*]Alle folgenden rennen um ARG verzögern
			//Es werden die startzeiten der nachfolgenden starts nicht automatisch nach hinten verschoben!!
			//Daher braucht es eine Funktion die das erledigt
			console.log(this.actlist)

			this.upddateRow(10);

			console.log(ARGcondition)



			//Komplette startwiederholung
			//Bei einer kompletten startwiederholung wird ein neustart eingeschoben, die restlichen Klassen haben zu warten. Die Reihenfolge wird nicht verändert.
			bsacts = this.createStartStates(
				[
					//TODO MOMENT VERKACKT FELIX FRAGEN
					{time: moment(lastStartTime).add(10,'m'),
					condition: ARGcondition},
				],true
			);

			//durch das Updateflags direkt unter dem Funktionskopf wird der step auf 6/13/20... gesetzt
			//das entspricht der letzten aktion des vorherigen starts, also des deaktivieren der rückrufbuttons
			//der neue start wird in die liste eingeschoben

			this.actlist.splice(this.step+2,0,...bsacts);
		}

		//Countdown überspringen
		this.updateFlags();
		this.updateFlags();


	}

	//Siehe 10 Zeilen oben [*]
	upddateRow = (time) => {

		//Slice liefert nur den gewünschten Teil des arrays zurück.
		//+2 weil im Moment des Funktionsaufrufs der stepcounter bei 5 ist
		let altered = this.actlist.slice(this.step+2, this.actlist.length)

		//Es muss beim constructor der actstates eine Funktion sein, die Moment-Elemente um X minuten nach hinten schiebt.
		altered.forEach(elem=> {
			elem.addTime(time);
		})
		console.log(altered);

		//Einfügen der veränderten Werte
		//splice(startINDEX, deletions in front, new elements)
		this.actlist.splice(this.step+2, 7, ...altered);
	}

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	updateFlags = () => {
		console.log('updateflags()')
		//Auffhören mit updaten wenn liste abgearbeitet
		if(this.step<(this.actlist.length-1)){
			this.setState({startFinished: false})
			this.step++;
			console.log(this.step-1);
			console.log(this.actlist.length);
			console.log(this.actlist);
			this.setState(this.actlist[this.step].getState());

			//war aktuelles element ein start?
			//wenn ja fehlstartbuttons anzeigen
			this.setState({buttons: this.actlist[this.step].wasStart()});

			//ist das gerade ein allgemeiner neustart?
			//Wenn ja flagpicker aktivieren
			this.setState({picker: this.actlist[this.step].wasBadStart()});
		}else{
				console.log('reached end of array')
				this.setState({startFinished: true})
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
						//console.log('App.render.onFinished()');
						if(!this.state.startFinished){
							this.updateFlags();
							//console.log('updateflags')
						}
					}}
				/>

				{
						this.state.buttons &&
						<Button
							title="Single bad Start"
							color="#841584"
							onPress={() => {
								this.setState({buttons: false});
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
					}
					{
						this.state.buttons &&
						<Button
							title="Massive Bad Start"
							color="#841584"
							onPress={() => {
								this.setState({buttons: false});
								this.setState({picker: true});
							}}
							style={{
								position: 'absolute',
								marginTop: '13.1%',
								marginLeft: '12.3%',
								marginRight: '25.6%',
							}}
							accessibilityLabel="Learn more about this purple button"
						/>
					}
					{
						this.state.picker &&
						<TouchableHighlight
							onPress={() => {
								this.setState({picker: false})
								this.setBadStart(false,'i');
						}}>
				      <Image
				        source={res.flags.i.pic}
				      />
				    </TouchableHighlight>
					}
					{
						this.state.picker &&
						<TouchableHighlight
							onPress={() => {
								this.setState({picker: false})


						}}>
				      <Image
				        source={res.flags.i.pic}
				      />
				    </TouchableHighlight>
					}
					{
						this.state.picker &&
						<TouchableHighlight
							onPress={() => {
								this.setState({picker: false})

						}}>
				      <Image
				        source={res.flags.black.pic}
				      />
				    </TouchableHighlight>
					}
					{
						this.state.picker &&
						<TouchableHighlight
							onPress={() => {
								this.setState({picker: false})

						}}>
				      <Image
				        source={res.flags.p.pic}
				      />
				    </TouchableHighlight>
					}
			</View>
		);
	};
}

//this.setBadStart(false,'black');
