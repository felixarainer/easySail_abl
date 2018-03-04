import React from 'react';
import {
	AsyncStorage,
	StyleSheet,
	AppRegistry,
	Text,
	TextInput,
	View,
	Button,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
		};
	}

	componentWillMount() {
		this.fetchData();
	}

	static navigationOptions = {
		header: null,
	};

	fetchData = async () => {
		/*try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);

      if (keys.length != 0) {
        this.setState({ keys: this.state.keys.concat([keys]) });
      } else {
        this.setState({
          keys: this.state.keys.concat(['Noch keine Regatta vorhanden']),
        });
      }
    } catch (error) {
      console.warn('Error retrieving data');
    }*/

		AsyncStorage.getAllKeys((err, keys) => {
			AsyncStorage.multiGet(keys, (err, stores) => {
				stores.map((result, i, store) => {
					// get at each store's key/value so you can work with it
					let key = store[i][0];
					let value = store[i][1];

					console.log(value);

					// console.log(JSON.parse(JSON.stringify({ hallo: 'hallo' })));
					console.log(JSON.parse(value));

					var hoi = JSON.parse(value);

					let obj = {
						regattaName: hoi['regattaName'],
						startDate: hoi['startDate'],
					};

					this.setState(prev => {
						return {
							data: [...prev.data, obj],
						};
					});
				});
			});
		});
	};

	renderList = () => {
		return (
			<View>
				{this.state.data.map(elem => {
					return (
						<Text key={elem.regattaName}>
							{elem.regattaName} am {elem.startDate}
						</Text>
					);
				})}
			</View>
		);
	};

	render() {
		const { state, navigate } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={{ flex: 1, alignItems: 'center' }}>
					{this.renderList()}
				</View>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Button onPress={() => navigate('Summary')} title="Neue Regatta" />
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
