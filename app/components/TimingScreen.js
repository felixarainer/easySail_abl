import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import GridView from 'react-native-super-grid';
import moment from 'moment';
import Modal from 'react-native-modal';
import styles from '../styles.js';
import * as res from '../res/res.js';
import { StackNavigator } from 'react-navigation';

export default class App extends Component {
  constructor(){
    super();

    this.klasses = [];

    this.items = [];
    //   [{ name: 'AUT11', checkPoint: 0, times: [], active: true },{ name: 'AUT12', checkPoint: 0, times: [], active: true },{ name: 'AUT13', checkPoint: 0, times: [], active: true },{ name: 'AUT14', checkPoint: 0, times: [], active: true },{ name: 'AUT15', checkPoint: 0, times: [], active: true },{ name: 'AUT16', checkPoint: 0, times: [], active: true },{ name: 'AUT17', checkPoint: 0, times: [], active: true }],
    //   [{ name: 'AUT21', checkPoint: 0, times: [], active: true },{ name: 'AUT22', checkPoint: 0, times: [], active: true },{ name: 'AUT23', checkPoint: 0, times: [], active: true },{ name: 'AUT24', checkPoint: 0, times: [], active: true },{ name: 'AUT25', checkPoint: 0, times: [], active: true },{ name: 'AUT26', checkPoint: 0, times: [], active: true },{ name: 'AUT27', checkPoint: 0, times: [], active: true }],
    //   [{ name: 'AUT21', checkPoint: 0, times: [], active: true },{ name: 'AUT22', checkPoint: 0, times: [], active: true },{ name: 'AUT23', checkPoint: 0, times: [], active: true },{ name: 'AUT24', checkPoint: 0, times: [], active: true },{ name: 'AUT25', checkPoint: 0, times: [], active: true },{ name: 'AUT26', checkPoint: 0, times: [], active: true },{ name: 'AUT27', checkPoint: 0, times: [], active: true }],
    // ];

    this.choices = [
      {key: 'DNC', text: 'Nicht erschienen (Did Not Come)'},
      {key: 'DNS', text: 'Nicht gestartet (Did Not Start)'},
      {key: 'BFD', text: 'Schwarze-Flagge DSQ (Black-Flag Disqualified)'},
      {key: 'DNF', text: 'Aufgegeben, Abgebrochen (Did Not Finish)'},
      {key: 'RAF', text: 'Nach Zieleinlauf Aufgegeben\n(Retired After Finishing)'},
      {key: 'DSQ', text: 'Disqualifiziert'},
    ]

    this.curElem = 0;

    this.state = {
      page: 0,
      menu: false,
      isMenuVisible: false,
      items: [[{ name: 'AUT11', checkPoint: 0, times: [], active: true }]],
      klasses: [{name:'Bitte Warten...'}],
      loaded: false,
    };

    this.finalArray = [];

    this.menuLogo = '>';
  }

  static navigationOptions = {
    header: null,
  };

  componentWillMount = () => {
    //this.klasses = this.props.navigation.state.params.order
    console.log(this.props.navigation.state.params.order);
    this.klasses = [];
    console.log(this.klasses)
    console.log(this.props.navigation.state.params.regattaKey)
    this.fetchData();
  }

  fetchData = async () => {

    console.log('fetchDataInTimeScreen');

    const { state, navigate } = this.props.navigation;
    if (this.props.navigation.state.params.regattaKey != 0) {
      var regattaData = JSON.parse(
        await AsyncStorage.getItem(this.props.navigation.state.params.regattaKey)
      );

      console.log(regattaData);
    }

    regattaData.teams.forEach((elem) => {
      console.log(elem);

      this.klasses.push({name: elem.name});
      this.team = [];
      elem.teams.forEach((elem) => {
        if(elem != '' && elem != null && elem != undefined){
          console.log(elem)
          this.team.push({name: elem, checkPoint: 0, times: [], active: true})
        }
      })
      this.items.push(this.team)
      console.log(this.team)
      console.log(this.items)
    })

    this.forceUpdate();

    this.setState({
      items: this.items,
    })

    this.setState({
      klasses: this.klasses,
    })

    this.setState({
      loaded: true,
    })
  };



  sortArray = () => {
    this.items.map((klass) => {
      klass.sort((a,b) => {
        if((typeof a.checkPoint === 'number') && (typeof b.checkPoint === 'number')){
          if(a.checkPoint > b.checkPoint){
            return -1;
          }else if(a.checkPoint < b.checkPoint){
            return 1;
          }else{
            return 0;
          }
        }
        else if(typeof a.checkPoint === 'number'){
          return -1;
        }else if(typeof b.checkPoint === 'number'){
          return 1;
        }else{
          return 0;
        }
      })
    })

    this.setState({
      items: this.items,
    })
  }

  handleSwitch = (arg) => {

    let cur = this.state.page;

    if(arg){
      cur++;
    }else{
      cur--;
    }

    if(cur<0){
      cur = this.klasses.length-1;
    }

    if(cur >= this.klasses.length){
      cur = 0;
    }

    this.setState({page: cur})
  }

  getTime = (item) => {
    item.times.push(moment().format('HH:mm:ss'));
  }

  setNA = (item) => {
    item.times.push('unklar');
  }

  setAll = (item, code) => {
    item.times.push(code);
    item.active = false;
    item.checkPoint = code;
  }

  extendBtn = () => {
    if(this.state.menu){
      this.setState({menu: false});
      this.menuLogo = '>';
    }else{
      this.setState({menu: true});
      this.menuLogo = '<';
    }
  }

  renderReturnBtn = () => {
    if(this.state.menu){
      return(
        <TouchableOpacity
          onPress={() => {
            const { state, navigate } = this.props.navigation;
            console.log(this.props.navigation)
            navigate('Start', {start: false,regattaKey: this.props.navigation.state.params.regattaKey});
          }}>
          <View style={stylesTime.returnBtn}>
            <Image style={stylesTime.footerBtn} source={res.menu.back}/>
          </View>
        </TouchableOpacity>
      );
    }else{
      return(
        <View style={stylesTime.returnBtn_dis}>
        </View>
      )
    }
  }

  renderFinishBtn = () => {
    if(this.state.menu){
      return(
        <TouchableOpacity
          onPress={() => {
            const { state, navigate } = this.props.navigation;
            console.log('Finish Race');
            this.createFinalArray();
            this.forceUpdate();
            navigate('Finish',{finalArray: this.finalArray})
          }}>
          <View style={stylesTime.finishBtn}>
            <Image style={stylesTime.footerBtn} source={res.div.checkered_flag}/>
          </View>
        </TouchableOpacity>
      );
    }else{
      return(
        <View style={stylesTime.returnBtn_dis}>
        </View>
      )
    }
  }

  toggleMenu = (arg) => {
		this.setState({ isMenuVisible: !this.state.isMenuVisible });
    if(arg !== undefined){
      var index = this.items[this.state.page].indexOf(arg);
      this.curElem = index;
    }
	};

  renderMenu = () => {
		console.log('renderMenu()');
		return (
			<View style={stylesTime.modal}>
        <View style={stylesTime.modalName}>
          <Text style={stylesTime.itemName}>{this.state.items[this.state.page][this.curElem].name}</Text>
        </View>

        <View style={stylesTime.modalChoices}>
          {
            this.choices.map((item) => {
              return(
                <View key={item.key} style={stylesTime.choice}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setAll(this.state.items[this.state.page][this.curElem], item.key);
                      this.toggleMenu();
                      this.sortArray();
                    }}>
                    <View style={stylesTime.choiceL}>
                      <Text style={stylesTime.itemName}>{item.key}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={stylesTime.choiceR}>
                    <Text style={stylesTime.itemCode}>{item.text}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>

        <View style={stylesTime.modalBtnContainer}>
          <TouchableOpacity
            onPress={() => {
              this.toggleMenu();
            }}>
            <View style={stylesTime.modalBtnBack}>
              <Text style={stylesTime.modalNameText}>Abbrechen</Text>
            </View>
          </TouchableOpacity>
        </View>
			</View>
		);
	};

  hhmmss_toSecs = (time) => {
    var a = time.split(':'); // split it at the colons
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds;
  }

  createFinalArray = () => {

    let kIndex = 0;
    let teamIndex = 0;


    let finalArray = [];

    this.items.map((klass) => {

      //Anzahl der Bojen des erstplatzierten, alle schiffe, die nicht so viele Bojen umrundet haben sind entweder ausgeschieden oder haben keine korrekten Messdaten
      let teamLeaderLength = 0;
      let leaderMom = undefined;

      // = erster index bei dem eine Zieldurchlaufzeit vorliegt. Es kann sein, dass der Regattaleiter den Einlauf des ersten Bootes übersieht
      //In diesem fall muss die Einlaufzeit für dieses Boot auf "unklar" gesetzt werden
      //Das Zweite Boot bekommt dann die Referenzzeit 00:00:00
      let firstTimedIndex = 0;

      //Dieser Codeblock bestimmt, ob die klasse iteriert werden soll,
      let klasslength = klass.length
      let iterate = true;
      if(klass.length > 0){
        let teamTimes = klass[klass.length-1].times.length

        if(teamTimes == 0){
          iterate = false;
        }
      }

      if(iterate){
        klass.map((team) => {
          let arr = []

          //Errechnen der einzelnen zeiten relativ zum startpunkt
          team.times.map((time) => {
            if(time.includes(':')){
              var diffTime = time;

              var momA = this.klasses[kIndex].starttime
              var momB = moment();

              var arr2 = diffTime.split(':')

              momB = momB.hour(arr2[0])
              momB = momB.minute(arr2[1])
              momB = momB.second(arr2[2])

              var diff = momB.diff(momA,'seconds')
              let newstr = this.hhmmss(diff);
              arr.push(newstr);
            }else{
              arr.push('');
            }
          })

          if(teamIndex === firstTimedIndex){
            //erster im Ziel bestimmt bojenanzahl und referenzZeitpunkt
            teamLeaderLength = team.times.length;
            leaderMom = arr[teamLeaderLength-1];

            if(teamLeaderLength != 0){
              //Team hat zeitwertungen
              if(team.times[teamLeaderLength-1] === 'unklar'){
                //erster im Ziel hat keine Zieldurchlaufzeit erfasst
                arr.push('unklar');
                firstTimedIndex++;
              }else{
                //erster im Ziel erfasster bekommt 00:00:00
                arr.push('00:00:00');
              }
            }
          }else{
            if(isNaN(team.checkPoint) && teamLeaderLength != 0){
              //ausgeschiedene bekommen CODE
              arr.push(team.checkPoint);
            }else if(teamLeaderLength != 0){
              //legal gesegelt
              if(team.times.length == teamLeaderLength){
                //Gleich viele Bojen umfahren wie erster == kompletten kurs gesegelt
                if(team.times[teamLeaderLength-1] === 'unklar'){
                  //Teams bei denen der Zieleinlauf übersehen wurde
                  arr.push('unklar')
                }else{
                  //Teams bei denen der Zieleinlauf erfasst wurde

                  let diffSecs = this.hhmmss_toSecs(arr[teamLeaderLength-1]) - this.hhmmss_toSecs(leaderMom);

                  //formatieren
                  let diffTime = '+' + this.hhmmss(diffSecs)
                  arr.push(diffTime);
                }
              }else{
                //aus irgendeinem grund eine Boje zu wenig umfahren, keine Zeiterfassung möglich
                let diff = teamLeaderLength - team.times.length

                for(i=0; i<diff; i++){
                  arr.push('nicht erfasst')
                }

                arr.push('nicht erfasst')
              }
            }
          }
          team.times = arr;
          teamIndex++;
        })
      }

      kIndex++;
      teamIndex = 0;
    })

    kIndex = 0;

    //umschreiben in neues Arry zum senden
    this.items.map((klass) => {
      finalArray.push({name: ' ', times: []})
      finalArray.push({name: this.klasses[kIndex].name, times: []})
      finalArray.push({name: ' ', times: []})

      klass.map((team) => {
        finalArray.push({name: team.name, times: team.times})
      })
      kIndex++;
    })

    finalArray.splice(0,1);

    this.finalArray = finalArray;

    console.log(this.finalArray)


  }

  saveData = async () => {
    try {
      await AsyncStorage.mergeItem(
        this.props.navigation.state.params.regattaKey,
        JSON.stringify({
          regattaTimes: this.finalArray,
        })
      );
    } catch (error) {
      console.warn('fehler beim schreiben');
    }
  };

  hhmmss = (secs) => {
    var minutes = Math.floor(secs / 60);
    secs = secs%60;
    var hours = Math.floor(minutes/60)
    minutes = minutes%60;

    var strhours = hours.toString();
    if(hours < 10){
      strhours = '0' + strhours;
    }

    var strminutes = minutes.toString();
    if(minutes < 10){
      strminutes = '0' + strminutes;
    }

    var strseconds = secs.toString();
    if(secs < 10){
      strseconds = '0' + strseconds;
    }

    //return hours.toString()+':'+minutes.toString()+':'+secs.toString();

    return strhours+':'+strminutes+':'+strseconds;
  }

  render() {
    if(this.state.loaded){
      return (
        <View>
          <GridView
            itemDimension={240}
            items={this.state.items[this.state.page]}
            style={stylesTime.gridView}
            renderItem={item => (
              <View style={stylesTime.itemContainer}>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleMenu(item);
                  }}>
                  <View style={stylesTime.itemContainerL}>
                    <Image style={stylesTime.dotButton} source={res.menu.menu_dots}/>
                  </View>
                </TouchableOpacity>
                <View style={stylesTime.itemContainerMid}>
                  <View style={stylesTime.nameContainer}>
                    <View style={stylesTime.nameContainer}>
                      <Text style={stylesTime.itemName}>{item.name}</Text>
                    </View>
                    <View style={stylesTime.btnContainer}>
                      <View style={stylesTime.btn2}>
                        <Text style={stylesTime.itemLeg}>Bahn</Text>
                      </View>
                      <View style={stylesTime.btn3}>
                        {item.active ? (
                          <Text style={stylesTime.itemCode}>{item.checkPoint+1}</Text>
                        ):(
                          <Text style={stylesTime.itemLeg}>{item.checkPoint}</Text>
                        )}
                      </View>
                      {item.active ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.setNA(item);
                            item.checkPoint++;
                            this.sortArray();
                            this.forceUpdate();
                          }}>
                          <View style={stylesTime.btn4}>
                            <Image style={stylesTime.skipButton} source={res.menu.skip}/>
                          </View></TouchableOpacity>
                        ):(
                          <View style={stylesTime.btn4_dis}>
                            <Image style={stylesTime.skipButton} source={res.menu.skip}/>
                          </View>)}
                    </View>
                  </View>
                </View>
                {item.active ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.getTime(item);
                      item.checkPoint++;
                      this.sortArray();
                      this.forceUpdate();
                    }}><View style={stylesTime.itemContainerR}>
                      <Image style={stylesTime.stopButton} source={res.div.stopwatch}/>
                    </View></TouchableOpacity>)
                    :
                    (<View style={stylesTime.itemContainerR_dis}>
                      <Image style={stylesTime.stopButton} source={res.div.stopwatch}/>
                    </View>)}
              </View>
            )}
          />
          <View style={stylesTime.footer}>
            <TouchableOpacity
              onPress={() => {
                this.handleSwitch(0);
              }}>
              <View style={stylesTime.nextlastBtn}>
                <Text style={stylesTime.itemTime}>prev</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.extendBtn();
              }}>
              <View style={stylesTime.extendBtn}>
              {this.state.menu ? (
                <Image style={stylesTime.footerBtn} source={res.menu.arrow_left}/>
              ):(
                <Image style={stylesTime.footerBtn} source={res.menu.arrow_right}/>
              )}
              </View>
            </TouchableOpacity>

            {this.renderReturnBtn()}

            <View style={stylesTime.klassDisplay}>
              <Text style={stylesTime.itemCode}>{this.state.klasses[this.state.page].name}</Text>
            </View>

            {this.renderFinishBtn()}

            <TouchableOpacity
              onPress={() => {
                this.handleSwitch(1);
              }}>
              <View style={stylesTime.nextlastBtn}>
                <Text style={stylesTime.itemTime}>next</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Modal isVisible={this.state.isMenuVisible}>
  					{this.renderMenu()}
  				</Modal>
        </View>
      );
    }else{
      return null;
    }

  }
}

const stylesTime = StyleSheet.create({
  footerBtn:{
    height: 80,
    width: 80,
  },
  stopButton: {
    height: 100,
    width: 40,
  },
  skipButton: {
    flex: 1,
    width: 50,
  },
  dotButton: {
    flex: 1,
    height: 100,
    width: 50,
  },
  choiceR:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  choiceL:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2bcbba',
    height: 65,
    width: 384,
  },
  choice:{
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalChoices: {
    flex: 6,
    flexDirection: 'column',
  },
  modalNameText: {
    fontWeight: '600',
    fontSize: 34,
    color: '#fff',
  },
  modalName: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  modalBtnBack: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eb3b5a',
    width: 384,
    height: 75,
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'lightgrey',
  },
  gridView: {
    paddingTop: 25,
    height: 650,
  },
  returnBtn: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eb3b5a',
  },
  finishBtn: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20bf6b',
  },
  returnBtn_dis: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  extendBtn: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2bcbba',
  },
  footer: {
    flexDirection: 'row',
    height: 80,
  },
  klassDisplay: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  nextlastBtn: {
    flex: 1,
    height: 80,
    width: 200,
    backgroundColor: '#a55eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn2: {
    flex: 3,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn3: {
    flex: 2,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn4: {
    flex: 2,
    backgroundColor: '#fc5c65',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  btn4_dis: {
    flex: 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  nameContainer: {
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    flex: 1,
  },
  btnContainer: {
    width: 120,
    flex: 1,
    flexDirection: 'row',
  },
  itemContainerR: {
    backgroundColor: '#20bf6b',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    width: 50,
  },
  itemContainerR_dis: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 50,
  },
  itemContainerMid: {
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
    width: 120,
  },
  itemContainerL: {
    backgroundColor: '#2bcbba',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 2,
    padding: 10,
    height: 120,
  },
  itemName: {
    fontSize: 28,
    color: '#000',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 34,
    color: '#000',
  },
  itemLeg: {
    fontWeight: '400',
    fontSize: 18,
    color: '#222',
  },
  itemTime: {
    fontWeight: '300',
    fontSize: 40,
    color: '#fff',
  },
});
