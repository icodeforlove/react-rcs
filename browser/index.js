'use strict';

var wrappedCreateClass = require('./wrappedCreateClass');

window.React.RCS = {
	Style: require('../style'),
	Properties: require('../properties'),
	Parser: require('../parser')
};
window.React.createClass = wrappedCreateClass(window.React.createClass);	
