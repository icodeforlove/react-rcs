'use strict';

var wrappedCreateClass = require('../browser/wrappedCreateClass');

module.exports = function (React) {
	React.createClass = wrappedCreateClass(React.createClass);
};