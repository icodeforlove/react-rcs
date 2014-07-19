'use strict';

var DOM = require('./dom');

var wrappedCreateClass = function (createClass) {
	return function (spec) {
		var render = spec.render;
		spec.render = function () {
			var node = render.apply(this, arguments);
			DOM.addClassPrefixToNode(node, spec.displayName);
			return node;
		};

		return createClass(spec);
	};
};

// are we in a browser where React is already defined?
if (typeof React !== 'undefined') {
	React.createClass = wrappedCreateClass(React.createClass);	
}

// export for node
module.exports = function (React) {
	React.createClass = wrappedCreateClass(React.createClass);
};