import React from 'react';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
	//main screen
	buttonLabel: {
		fontSize: 44,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#d1d8e0',
	},
	buttonHighlight: { justifyContent: 'center', flex: 1, padding: 5 },

	buttonDisabled: { backgroundColor: '#778ca3' },
	countdownText: { fontSize: 80, fontWeight: 'bold', textAlign: 'center' },

	//actionview
	actionViewItem: {
		height: 160,
		width: 240,
		alignSelf: 'center',
		marginBottom: 10,
	},

	//special actions menu
	listEntryHighlight: {
		justifyContent: 'center',
		flex: 1,
		padding: 5,
		borderBottomWidth: 1,
		backgroundColor: '#26de81',
	},
	listEntrySelected: {
		backgroundColor: '#20bf6b',
	},
	listEntryText: { fontSize: 30, textAlign: 'center' },
	cancelButton: { backgroundColor: 'red' },
	okButton: { backgroundColor: 'green' },

	descriptionText: { fontSize: 35, padding: 5 },

	actionMenuItem: {
		height: 180,
		width: 270,
		alignSelf: 'center',
	},

	//startpicker

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
	spFlag: {
		height: 150,
		width: 150,
	},
});
