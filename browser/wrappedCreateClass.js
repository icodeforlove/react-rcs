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

module.exports = wrappedCreateClass;