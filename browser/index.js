'use strict';

var React = window.React,
	DOM = require('./dom');

if (typeof React !== 'undefined') {
	React.createClass = (function (createClass) {
		return function (spec) {
			var render = spec.render;
			spec.render = function () {
				var node = render.apply(this, arguments);
				DOM.addClassPrefixToNode(node, spec.displayName);
				return node;
			};

			return createClass(spec);
		};
	})(React.createClass);
}
