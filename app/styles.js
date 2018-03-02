import React from 'react';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
	containerAV: {
		flex: 1,
		alignSelf: 'stretch',
		flexDirection: 'column',
	},
	actionContainer: {
		//padding: '5%',
		borderWidth: 1,
		backgroundColor: 'lightgreen',
		alignSelf: 'stretch',
		//alignItems: 'center',
		//justifyContent: 'space-between',
	},
	buttonLabel: { fontSize: 40, fontWeight: 'bold', textAlign: 'center' },
	buttonHighlight: { justifyContent: 'center', flex: 1 },
	buttonDisabled: { backgroundColor: '#778ca3' },
	countdownText: { fontSize: 64, fontWeight: 'bold' },
});
