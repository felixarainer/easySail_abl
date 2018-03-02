import React from 'react';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
	buttonLabel: { fontSize: 44, fontWeight: 'bold', textAlign: 'center' },
	buttonHighlight: { justifyContent: 'center', flex: 1, padding: 5 },
	buttonDisabled: { backgroundColor: '#778ca3' },
	countdownText: { fontSize: 80, fontWeight: 'bold', textAlign: 'center' },

	listEntryHighlight: {
		justifyContent: 'center',
		flex: 1,
		padding: 5,
		borderWidth: 1,
		backgroundColor: '#26de81',
	},
	listEntryText: { fontSize: 30, textAlign: 'center' },

	//actionsBackground: {}
});
