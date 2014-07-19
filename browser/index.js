'use strict';

var wrappedCreateClass = require('./wrappedCreateClass');

// are we in a browser where React is already defined?
if (typeof window !== 'undefined' && typeof window.React) {
	window.React.RCS = {
		Style: require('./style'),
		Properties: require('./properties'),
		Parser: require('./parser')
	};
	window.React.createClass = wrappedCreateClass(window.React.createClass);	
}

// export for node
module.exports = function (React) {
	React.createClass = wrappedCreateClass(React.createClass);
};