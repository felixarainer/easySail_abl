import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import GridView from 'react-native-super-grid';
import moment from 'moment';
import Modal from 'react-native-modal';

export default class App extends Component {
  constructor(){
    super();

    this.klasses = [
      {name: 'Drachen', starttime: '07:00:00'},
      {name: 'Laser', starttime: '07:05:00'},
      {name: 'TopKat', starttime: '07:10:00'},
    ]

    this.items = [
      [{ name: 'AUT11', checkPoint: 0, times: [], active: true },{ name: 'AUT12', checkPoint: 0, times: [], active: true },{ name: 'AUT13', checkPoint: 0, times: [], active: true },{ name: 'AUT14', checkPoint: 0, times: [], active: true },{ name: 'AUT15', checkPoint: 0, times: [], active: true },{ name: 'AUT16', checkPoint: 0, times: [], active: true },{ name: 'AUT17', checkPoint: 0, times: [], active: true }],
      [{ name: 'AUT21', checkPoint: 0, times: [], active: true },{ name: 'AUT22', checkPoint: 0, times: [], active: true },{ name: 'AUT23', checkPoint: 0, times: [], active: true },{ name: 'AUT24', checkPoint: 0, times: [], active: true },{ name: 'AUT25', checkPoint: 0, times: [], active: true },{ name: 'AUT26', checkPoint: 0, times: [], active: true },{ name: 'AUT27', checkPoint: 0, times: [], active: true }],
      [{ name: 'AUT31', checkPoint: 0, times: [], active: true },{ name: 'AUT32', checkPoint: 0, times: [], active: true },{ name: 'AUT33', checkPoint: 0, times: [], active: true },{ name: 'AUT34', checkPoint: 0, times: [], active: true },{ name: 'AUT35', checkPoint: 0, times: [], active: true },{ name: 'AUT36', checkPoint: 0, times: [], active: true },{ name: 'AUT37', checkPoint: 0, times: [], active: true }],
    ];

    this.choices = [
      {code: 'DNC', text: 'Nicht erschienen (Did Not Come)'},
      {code: 'DNS', text: 'Nicht gestartet (Did Not Start)'},
      {code: 'BFD', text: 'Schwarze-Flagge DSQ (Black-Flag Disqualified)'},
      {code: 'DNF', text: 'Aufgegeben, Abgebrochen (Did Not Finish)'},
      {code: 'RAF', text: 'Nach Zieleinlauf Aufgegeben\n(Retired After Finishing)'},
      {code: 'DSQ', text: 'Disqualifiziert'},
    ]

    this.curElem = 0;

    this.state = {
      page: 0,
      menu: false,
      isMenuVisible: false,
    };

    this.menuLogo = '>';
  }

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
  }

  handleSwitch = (arg) => {
    let cur = this.state.page;

    if(arg){
      cur++;
    }else{
      cur--;
    }

    if(cur<0){
      cur = this.items.length-1;
    }

    if(cur >= this.items.length){
      cur = 0;
    }

    this.setState({page: cur})
  }

  getTime = (item) => {
    item.times.push(moment().format('HH:mm:ss'));
  }

  setNA = (item) => {
    item.times.push(undefined);
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
            console.log('return to old Screen');
          }}>
          <View style={styles.returnBtn}>
            <Text style={styles.itemCode}>B</Text>
          </View>
        </TouchableOpacity>
      );
    }else{
      return(
        <View style={styles.returnBtn_dis}>
        </View>
      )
    }
  }

  renderFinishBtn = () => {
    if(this.state.menu){
      return(
        <TouchableOpacity
          onPress={() => {
            console.log('Finish Race');
            this.createFinalArray();
            this.forceUpdate();
            console.log(this.items)
          }}>
          <View style={styles.finishBtn}>
            <Text style={styles.itemCode}>F</Text>
          </View>
        </TouchableOpacity>
      );
    }else{
      return(
        <View style={styles.returnBtn_dis}>
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
		console.log('renderStartPicker()');
		return (
			<View style={styles.modal}>
        <View style={styles.modalName}>
          <Text style={styles.itemName}>{this.items[this.state.page][this.curElem].name}</Text>
        </View>

        <View style={styles.modalChoices}>

          {
            this.choices.map((item) => {
              return(
                <View style={styles.choice}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setAll(this.items[this.state.page][this.curElem], item.code);
                      this.toggleMenu();
                      this.sortArray();
                    }}>
                    <View style={styles.choiceL}>
                      <Text style={styles.itemName}>{item.code}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.choiceR}>
                    <Text style={styles.itemCode}>{item.text}</Text>
                  </View>
                </View>
              )


            })
          }

        </View>

        <View style={styles.modalBtnContainer}>
          <TouchableOpacity
            onPress={() => {
              this.toggleMenu();
            }}>
            <View style={styles.modalBtnBack}>
              <Text style={styles.modalNameText}>Abbrechen</Text>
            </View>
          </TouchableOpacity>
        </View>
			</View>
		);
	};

  createFinalArray = () => {

    let kIndex = 0;

    this.items.map((klass) => {
      klass.map((team) => {
        let arr = []
        team.times.map((time) => {
          if(time.includes(':')){
            var start = this.klasses[kIndex].starttime;
            var diffTime = time;

            var momA = moment();
            var momB = moment();

            var arr1 = start.split(':')
            var arr2 = diffTime.split(':')

            momA = momA.hour(arr1[0])
            momA = momA.minute(arr1[1])
            momA = momA.second(arr1[2])

            momB = momB.hour(arr2[0])
            momB = momB.minute(arr2[1])
            momB = momB.second(arr2[2])

            var diff = momB.diff(momA,'seconds')
            let newstr = this.hhmmss(diff);
            arr.push(newstr);
          }else{
            arr.push();
          }
        })
        team.times = arr;
      })
      kIndex++;
    })
  }

  hhmmss = (secs) => {
    var minutes = Math.floor(secs / 60);
    secs = secs%60;
    var hours = Math.floor(minutes/60)
    minutes = minutes%60;
    return hours.toString()+':'+minutes.toString()+':'+secs.toString();
  }

  render() {
    return (
      <View>
        <GridView
          itemDimension={240}
          items={this.items[this.state.page]}
          style={styles.gridView}
          renderItem={item => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.toggleMenu(item);
                }}>
                <View style={styles.itemContainerL}>
                  <Text style={styles.itemTime}>M</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.itemContainerMid}>
                <View style={styles.nameContainer}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>
                  <View style={styles.btnContainer}>
                    <View style={styles.btn2}>
                      <Text style={styles.itemLeg}>Bahn</Text>
                    </View>
                    <View style={styles.btn3}>
                      {item.active ? (
                        <Text style={styles.itemCode}>{item.checkPoint+1}</Text>
                      ):(
                        <Text style={styles.itemLeg}>{item.checkPoint}</Text>
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
                        <View style={styles.btn4}>
                          <Text style={styles.itemSkip}>S</Text>
                        </View></TouchableOpacity>
                      ):(
                        <View style={styles.btn4_dis}>
                          <Text style={styles.itemSkip}>S</Text>
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
                  }}><View style={styles.itemContainerR}>
                    <Text style={styles.itemTime}>T</Text>
                  </View></TouchableOpacity>)
                  :
                  (<View style={styles.itemContainerR_dis}>
                    <Text style={styles.itemTime}>T</Text>
                  </View>)}
            </View>
          )}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              this.handleSwitch(0);
            }}>
            <View style={styles.nextlastBtn}>
              <Text style={styles.itemTime}>prev</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.extendBtn();
            }}>
            <View style={styles.extendBtn}>
              <Text style={styles.itemCode}>{this.menuLogo}</Text>
            </View>
          </TouchableOpacity>

          {this.renderReturnBtn()}

          <View style={styles.klassDisplay}>
            <Text style={styles.itemCode}>{this.klasses[this.state.page].name}</Text>
          </View>

          {this.renderFinishBtn()}

          <TouchableOpacity
            onPress={() => {
              this.handleSwitch(1);
            }}>
            <View style={styles.nextlastBtn}>
              <Text style={styles.itemTime}>next</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal isVisible={this.state.isMenuVisible}>
					{this.renderMenu()}
				</Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    width: 40,
  },
  btn4_dis: {
    flex: 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
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
  itemSkip: {
    fontWeight: '400',
    fontSize: 34,
    color: '#fff',
  },
  itemTime: {
    fontWeight: '300',
    fontSize: 40,
    color: '#fff',
  },
});
