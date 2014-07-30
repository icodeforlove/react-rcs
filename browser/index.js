'use strict';

var wrappedCreateClass = require('./wrappedCreateClass');

window.React.RCS = {
	Properties: require('../properties')
};

window.React.createClass = wrappedCreateClass(window.React.createClass);