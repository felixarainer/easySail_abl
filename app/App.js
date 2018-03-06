import React from 'react';
import {
	StyleSheet,
	AppRegistry,
	Text,
	TextInput,
	View,
	Button,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import BoatClassScreen from './components/BoatClassScreen';
import HomeScreen from './components/HomeScreen';
import SummaryScreen from './components/SummaryScreen';
import RegattaStartScreen from './components/RegattaStartScreen';

export const SimpleApp = StackNavigator(
	{
		Home: { screen: HomeScreen },
		BoatClass: { screen: BoatClassScreen },
		Summary: { screen: SummaryScreen },
		Start: { screen: RegattaStartScreen },
	},
	{
		transitionConfig: () => ({ screenInterpolator: () => null }),
	}
);

export default class App extends React.Component {
	render() {
		return <SimpleApp />;
	}
}
