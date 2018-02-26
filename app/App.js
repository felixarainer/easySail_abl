// App - main component
//
// Hosts FlagView and ActionView. Passes current Flags / Actions (TODO) / Count-
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
import ActionView from './components/ActionView';
import FlagItem from './components/FlagItem';
import Orientation from 'react-native-orientation-locker';
import * as res from './res/res.js';
import moment from 'moment';
import Modal from 'react-native-modal';
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
			viewBadStartBtns: this.isStart,
			isIndefinite: this.isIndefinite,
			isSkippable: this.isSkippable,
		};
	};

	wasStart = () => {
		return this.isStart;
	}

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
			specialDescription: '',
			isSkippable: undefined,
			isIndefinite: undefined,
      postPoneBadStart: undefined,
			specialChoice: 99,	//99 = orange flagge setzen beim start, wird normalerweise nur für die specialactions benutzt, ausnahme
			isSpecial: false,
			interval: 10,

		};
		this.step = 0;

		this.specialBtnsDescs = [
			{choice: 0, button: 'Verschieben (kurz)', description: 'Alle noch nicht gestarteten Rennen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP". \nWenn Sie die Wettfahrt(en) fortführen möchten klicken Sie auf den Countdown'},
			{choice: 1,button: 'Verschieben (lang)', description: 'Alle noch nicht gestarteten Rennen werden verschoben. \nBereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP" über der Flagge "H". \nWeitere Signale an Land geben.\nWenn Sie die Wettfahrt(en) fortführen möchten klicken Sie auf den Countdown'},
			{choice: 2,button: 'Verschieben und abbrechen', description: 'Alle noch nicht gestarteten Rennen werden verschoben. \nHeute findet keine Wettfahrt mehr statt. Bereits gestartete Rennen werden weiter gesegelt. \nSofortiges setzen der Flagge "AP" über der Flagge "A".'},
			{choice: 3,button: 'Abbrechen (rasche WH)', description: 'Alle bereits gestarteten Rennen werden abgebrochen \nAlle Boote kehren zum Startgebiet zurück \nSofortiges setzen der Flagge "N". \nWenn Sie die Wettfahrt(en) erneut starten möchten klicken Sie auf den Countdown'},
			{choice: 4,button: 'Abbrechen (spätere WH)', description: 'Alle bereits gestarteten Rennen werden abgebrochen \nSofortiges setzen der Flagge "N" über der Flagge "H". \nWeitere Signale an Land geben.\nWenn Sie die Wettfahrt(en) erneut starten möchten klicken Sie auf den Countdown'},
			{choice: 5,button: 'Regatta Abbrechen', description: 'Alle bereits gestarteten Rennen werden abgebrochen \nHeute findet keine Wettfahrt mehr statt\nSofortiges setzen der Flagge "N" über der Flagge "A"'},
			{choice: undefined,button: 'Schwimmwesten anlegen (Aufruf)', description: 'Setzen der Flagge "Y"'},

		];
	}

	componentWillMount() {
		this.actlist = this.createStartStates(
			[
				{
					time: moment().add(1, 'minutes'),
					condition: 'i',
					badstart: false,
				},{
					time: moment().add((1+this.state.interval), 'minutes'),
					condition: 'p',
					badstart: false,
				},
			],
		);
		this.setInitialFlags();
	}

	//starttime ist immer absoluter start, -5min für startvorbereitungen jeglicher art.
	createStartStates = args => {
		let ac = [];

		args.forEach(start => {
			let starttime = moment(start.time).subtract(5, 'minutes');
			//1ste aktion
			if (start.badstart) {
				ac.push(
					new actState(
						[res.flags.orange,res.flags.fhs, {}, {}],
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
				if(ac.length < 1){

					ac.push(
						new actState(
							[{},{}, {}, {}],
							[
								{
									name: 'TestAction2',
									actionPic: res.actions.flag_up,
									flagPic: res.flags.orange,
								},
							],
							//effektiv 10 minuten vor tatsächlichem ersten start.
							starttime.subtract(5,'minutes'),
							false,
							0,
              true,
              true
						)
					);

				}else{
          ac.push(
    				new actState(
    					[res.flags.orange, {}, {}, {}],
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
					[res.flags.orange, {}, {}, {}],
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
					[res.flags.orange, res.flags.klass, {}, {}],
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
					false,
					false
				)
			);

			ac.push(
				//4te aktion
				//Condition Flagge gesetzt
				//3 minuten bis zum 1 min signal
				new actState(
				 [res.flags.orange, res.flags.klass, res.flags[start.condition], {}],
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
					false,
					false
				)
			);

			ac.push(
				//5te aktion
				//1 minuten signal geschossen, condition flagge geborgen
				//1 minute bis start
				new actState(
					[res.flags.orange, res.flags.klass, {}, {}],
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
					false,
					false
				)
			);

			//nach dem start alle flaggen bergen und solange
			//kein button press keine nächsten aktionen
			ac.push(
				new actState(
					[res.flags.orange, {}, {}, {}],
					[],
					moment(starttime)
						.add(5, 'm')
						.add(10, 's'),
					true,
					5,
					false,
					false
				)
			);

			ac.push(
				new actState(
					[res.flags.orange, {}, {}, {}],
					[],
					moment(starttime)
						.add(5, 'm')
						.add(11, 's'),
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

	singleBadStart = () => {
		//Einzelrückruf
		//bei einem Einzelrückruf wird die Flagge x gesetzt, bis die einzelrückrufer ihrer erneuten startpflicht nachgekommen sind
		//Sind die Teilnehmer ihrer pflicht nachgekommen wird ein button zur bestätigung gedrückt.

		console.log('singlebadStart()')

		//updateflags freischalten (wird blockiert, wenn ende der aktionen erreicht ist)
		this.setState({ startFinished: false });
		//rückrufbuttons deaktivieren
		this.setState({ viewBadStartBtns: false });

		//neue actions
		let bsacts = [];

		bsacts.push(
			new actState(
				[res.flags.orange, res.flags.x,  {}, {}],
				[],
				//4 minuten werden hier eingefügt, da nächstes ankündigungssignal noch nicht gegeben
				moment().add(4, 'm'),
				false,
				undefined,
        false,
        false
			)
		);

		this.actlist.splice(this.step+1, 0, ...bsacts)
		this.updateFlags();
		this.actlist.splice(this.step, 1)
	}

	massiveBadStart = (single, ARGcondition) => {
		//updateflags freischalten (wird blockiert, wenn ende der aktionen erreicht ist)
		this.setState({ startFinished: false });
		//rückrufbuttons deaktivieren
		this.setState({ viewBadStartBtns: false });

		//neue actions
		let bsacts = [];

		console.log('massive bad start()')
		this.setState({ viewStartPicker: false });
		let mom = moment();

		if(this.state.postPoneBadStart){

			mom = this.actlist[this.step+6].getTime();

		}else{
			//SppecialChoice 98: 1fhs
			this.setState({specialChoice: 98})
		}

    bsacts = this.createStartStates(
			[
				{
					time: mom,
					condition: ARGcondition,
					badstart: true,
				},
			],
		);


    let rank = this.actlist[this.step].getRank();
    let pos = undefined;

    //richtiges einfügen in die pipeline
		//zeit updaten hier hinein.
    if(this.state.postPoneBadStart){
      this.setState({postPoneBadStart: false})
      if(this.actlist[this.step].getRank()>4){
        pos = this.step - rank + 14;
        this.actlist.splice(pos, 0, ...bsacts)
        this.step += (6-rank);
      }else{
        pos = this.step - rank + 7;
  			this.actlist.splice(pos, 0, ...bsacts);
        this.step -= (rank+1);
      }
    }else{
      if(this.actlist[this.step].getRank()>4){
        pos = this.step - rank + 7;
        this.actlist.splice(pos, 0, ...bsacts)
        this.step += (6-rank);
      }else{
        pos = this.step - rank;
        this.actlist.splice(pos, 0, ...bsacts);
        this.step -= (rank+1);
      }
    }
    this.updateFlags();
	};

	updateRowByTime = (time,unit,startStep) => {
		//Alles um <time> <unit> verschieben. Ab startstep in der pipeline

		//Slice liefert nur den gewünschten Teil des arrays zurück.
		//+2 weil im Moment des Funktionsaufrufs der stepcounter bei 5 ist
		let altered = this.actlist.slice(startStep, this.actlist.length);

		//Es muss beim constructor der actstates eine Funktion sein, die Moment-Elemente um X minuten nach hinten schiebt.
		altered.forEach(elem => {
			elem.addTime(time, unit);
		});

		//Einfügen der veränderten Werte
		//splice(startINDEX, deletions in front, new elements)
		this.actlist.splice(startStep, altered.length, ...altered);
	};

	updateRowToTime = (time,unit,startStep) => {
		console.log('updateRowToTime()')

		let newTime = moment().add(time,unit)
		let oldTime = this.actlist[startStep].getTime();
		let diff = newTime.diff(oldTime,'s');

		this.updateRowByTime(diff,'s',startStep);
	}

	componentDidMount = () => {
		//ggf zu lockTolandscapeLeft() aendern
		Orientation.lockToLandscape();
	};

	dropOrangeFlag = () => {
		let swapStates = [];

		let oldFlags = this.actlist[this.actlist.length -1].getFlags();
		let oldTime = this.actlist[this.actlist.length -1].getTime();
		let oldStart = this.actlist[this.actlist.length -1].wasStart();

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
        false,
        true
			)
		);

		this.actlist.splice(this.actlist.length-1, 1, ...swapStates);
	}

	updateFlags = () => {
		//Auffhören mit updaten wenn liste abgearbeitet
		if (this.step < this.actlist.length - 1) {
			this.setState({ startFinished: false });
			this.step++;
			console.log('updateFlags-beforeSetState')
			console.log(this.step);
			console.log(this.actlist.length);
			console.log(this.actlist);
			console.log(this.actlist[this.step].getState())
			this.setState(this.actlist[this.step].getState());
			console.log('updateFlags-afterSetState')
			if(this.step === this.actlist.length - 3){
				this.dropOrangeFlag();
			}
		} else {
			this.setState({ startFinished: true });
		}
	};

	postponeAP = () => {
		let postActs = [];
		let newTime = 0;

		postActs.push(
			new actState(
				[res.flags.orange,res.flags.ap, {}, {}],
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
				[{}, res.flags.apoh, {}, {}],
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
				[{}, res.flags.apoa, {}, {}],
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
		console.log('cancel_N')
		let cancelActs = [];
		let newTime = 0;

		cancelActs.push(
			new actState(
				[res.flags.orange, res.flags.n, {}, {}],
				[],
				moment(),
				false,
        undefined,
        true,
        true,
			)
		);


		this.actlist.splice(0, 0, ...cancelActs)
		this.step = -1;
		this.updateFlags();
	}

	cancelNH = () => {
		console.log('cancel_NOH')
		let cancelActs = [];
		let newTime = 0;

		cancelActs.push(
			new actState(
				[{}, res.flags.noh, {}, {}],
				[],
				moment(),
				false,
        undefined,
        true,
        true,
			)
		);


		this.actlist.splice(0, 0, ...cancelActs)
		this.step = -1;
		this.updateFlags();
	}

	cancelNA = () => {
		console.log('cancel_NOA()')
		let cancelActs = [];
		let newTime = 0;

		cancelActs.push(
			new actState(
				[{}, res.flags.noa, {}, {}],
				[],
				moment(),
				false,
        undefined,
        false,
        false,
			)
		);

		this.actlist = cancelActs;
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

              this.badStartCondition = 'i';
						}}
					>
						<Image source={res.flags.i.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {

              this.badStartCondition = 'z';
						}}
					>
						<Image source={res.flags.z.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {

              this.badStartCondition = 'black';
						}}
					>
						<Image source={res.flags.black.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {

              this.badStartCondition = 'p';
						}}
					>
						<Image source={res.flags.p.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
          <TouchableHighlight
						style={styles.spHighlight}
						onPress={() => {
							this.setState({postPoneBadStart: true})
						}}
					>
						<Image source={res.flags.p.pic} style={styles.spFlagImage} />
					</TouchableHighlight>
          <TouchableOpacity onPress={() => {
						this.setState({ viewStartPicker: false });
            this.massiveBadStart(this.badStartCondition);
					}}>
						<Text style={{ fontSize: 40 }}>Weiter!</Text>
					</TouchableOpacity>

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
						this.singleBadStart();
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
			case 3:
				this.cancelN();
				break;
			case 4:
				this.cancelNH();
				break;
			case 5:
				this.cancelNA();
				break;
			default:

		this.setState({specialChoice: undefined})
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
									case 3:
									case 4:
									case 98:
										this.updateRowToTime(1,'m',this.step+1)
										break;
									case 99:
										this.updateRowToTime(5,'m',this.step+1)
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

//isSkippable={this.state.isIndefinite}
//isIndefinite={this.state.isSkippable}

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
