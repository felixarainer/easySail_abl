//res - saves flags / actions (TODO) as constants, is imported by App.js

export const flags = {
	fhs: {
		name: 'fhs',
		pic: require('./pics/flags/1hs.png'),
		ratio: 1.57,
	},
	black: {
		name: 'black',
		pic: require('./pics/flags/black.png'),
		ratio: 1,
		description:
			'Schwarze Flagge - (härteste Strafe)\nBoote müssen in der Minute vor dem Start vollständig hinter der Ziellinie sein (dürfen aber ihre Verlängerungen durchfahren).\nFehlstarter werden sofort disqualifiziert es sei denn die Wettfahrt wird noch vor dem Start verschoben oder abgebrochen.\nBeim Allgemeinen Rückruf muss die Segelnummer des ausgeschiedenen am Startschiff aushängen.',
	},
	i: {
		name: 'i',
		pic: require('./pics/flags/i.png'),
		ratio: 1,
		description:
			'Flagge I - (wird nicht empfohlen)\nBoote müssen beim Start vollständig hinter der Startlinie sein.\nFehlstarter müssen die Startlinie durch ihre Verlängerungen umfahren und erneut über die Ziellinie starten.',
	},
	l: {
		name: 'l',
		pic: require('./pics/flags/l.png'),
		ratio: 1,
	},
	p: {
		name: 'p',
		pic: require('./pics/flags/p.png'),
		ratio: 1,
		description:
			'Flagge P - (empfohlen für ersten Start)\nBoote müssen beim Start vollständig hinter der Ziellinie sein.\nFehlstarter dürfen an beliebiger Stelle wieder hinter die Ziellinie fahren und erneut starten.',
	},
	x: {
		name: 'x',
		pic: require('./pics/flags/x.png'),
		ratio: 1,
	},
	z: {
		name: 'z',
		pic: require('./pics/flags/z.png'),
		ratio: 1,
		description:
			'Flagge Z - (wird nicht empfohlen)\nBoote müssen in der Minute vor dem Start vollständig hinter der Ziellinie sein (dürfen aber ihre Verlängerungen durchfahren).\nFehlstarter erhalten jedes mal eine 20% Wertungsstrafe.\nAuch wenn die Wettfahrt erneut gestartet oder gesegelt wird, bleibt(bleiben) die Wertungsstrafe(n) bestehen, jedoch nicht, wenn sie vor dem Startsignal verschoben oder abgebrochen wird.',
	},
	klass: {
		name: 'klass',
		pic: require('./pics/flags/klass.png'),
		ratio: 1,
	},
	a: {
		name: 'a',
		pic: require('./pics/flags/a.png'),
		ratio: 1,
	},
	h: {
		name: 'h',
		pic: require('./pics/flags/h.png'),
		ratio: 1,
	},
	apoa: {
		name: 'apoa',
		pic: require('./pics/flags/apoa.png'),
		ratio: 1,
	},
	apoh: {
		name: 'apoh',
		pic: require('./pics/flags/apoh.png'),
		ratio: 1,
	},
	ap: {
		name: 'ap',
		pic: require('./pics/flags/ap.png'),
		ratio: 1,
	},
	n: {
		name: 'n',
		pic: require('./pics/flags/n.png'),
		ratio: 1,
	},
	noa: {
		name: 'noa',
		pic: require('./pics/flags/noa.png'),
		ratio: 1,
	},
	noh: {
		name: 'noh',
		pic: require('./pics/flags/noh.png'),
		ratio: 1,
	},
	orange: {
		name: 'orange',
		pic: require('./pics/flags/orange.png'),
		ratio: 1,
	},
	y: {
		name: 'y',
		pic: require('./pics/flags/y.png'),
		ratio: 1,
	},
	u: {
		name: 'u',
		pic: require('./pics/flags/u.png'),
		ratio: 1,
		description:
			'Flagge U - (bei großen Jollenfeldern geeignet)\nBoote müssen in der Minute vor dem Start hinter der Ziellinie sein (dürfen aber ihre Verlängerungen durchfahren).\nFehlstarter werden sofort disqualifiziert, dürfen aber bei einem Allgemeinen Rückruf mitstarten.\nFehlstarter dürfen erneut starten, wenn die Wettfahrt vor dem Startsignal verschoben oder abgebrochen wird.',
	},
};

export const menu = {
	arrow_right: require('./pics/menu/arrow_right.png'),
	arrow_left: require('./pics/menu/arrow_left.png'),
	burger_menu: require('./pics/menu/burger_menu.png'),
	menu_dots: require('./pics/menu/menu_dots.png'),
	skip: require('./pics/menu/skip.png'),
	back: require('./pics/menu/back.png'),
};

export const div = {
	peilstange: require('./pics/div/peilstange.png'),
	ship_long: require('./pics/div/ship_long.png'),
	ship_short: require('./pics/div/ship_short.png'),
	ship: require('./pics/div/ship_short.png'),
	checkered_flag: require('./pics/div/checkered_flag.png'),
	stopwatch: require('./pics/div/stopwatch.png'),
	fhs: require('./pics/div/fhs_opacity.png'),
	x: require('./pics/div/x.png'),
};

export const actions = {
	flag_up: require('./pics/actions/flag_up.png'),
	flag_down: require('./pics/actions/flag_down.png'),
	signal_1: require('./pics/actions/signal_1.png'),
	signal_2: require('./pics/actions/signal_2.png'),
	signal_3: require('./pics/actions/signal_3.png'),
};
