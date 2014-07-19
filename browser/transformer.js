'use strict';

var React = window.React,
	Style = require('../style'),
	StyleSheet = require('./stylesheet'),
	Properties = require('../properties'),
	Parser = require('../parser'),
	contentLoaded = require('./contentLoaded'),
	sendRequest = require('./sendRequest'),
	wrappedCreateClass = require('./wrappedCreateClass');

// initializes ReactStyle, mainly used for adding mixins
if (typeof React.RCSPropertiesInit !== 'undefined') {
	React.RCSPropertiesInit(Properties);
	delete React.RCSPropertiesInit;
}

React.createClass = wrappedCreateClass(React.createClass);

function processRCSSource (source, name) {
	var css = '';
	var rcs = Parser.parseRCS(source, name);

	for (var selector in rcs) {
		if (selector.match(/\@component/)) {
			var componentName = selector.match(/@component (.+)/)[1];
			var style = new Style(componentName, rcs[selector]);
			css += '/* Style for component ' + componentName + ' */\n';
			css += style.toString() + '\n\n';
			delete rcs[selector];
		}
	}

	if (name) {
		css += new Style(name, rcs);
	}

	return css.trim();
}

// process html
contentLoaded(window, function () {
	// replace rcs style tags
	var rcsStyles = Array.prototype.slice.call(document.querySelectorAll('style[type="text/rcs"]'));
	rcsStyles.forEach(function (style) {
		var name = style.getAttribute('component');
		var element = document.createElement('style');
		element.innerHTML = processRCSSource(style.innerHTML, name);
		element.setAttribute('type', 'text/css');
		if (name) {
			element.setAttribute('component', name);
		}

		style.parentNode.replaceChild(element, style);
	});

	// replace rcs link tags
	var rcsLinks = Array.prototype.slice.call(document.querySelectorAll('link[rel="stylesheet/rcs"][type="text/css"]'));
	rcsLinks.forEach(function (link) {
		var name = link.getAttribute('component');

		sendRequest(link.getAttribute('href'), function (request) {
			var element = document.createElement('style');
			element.innerHTML = processRCSSource(request.responseText, name);
			element.setAttribute('type', 'text/css');
			if (name) {
				element.setAttribute('component', name);
			}
			link.parentNode.replaceChild(element, link);
		});
	});
});

window.React.RCS = {
	Style: Style,
	Properties: StyleSheet,
	Parser: Parser
};

exports.Style = Style;
exports.StyleSheet = StyleSheet;
exports.Properties = Properties;
exports.Parser = Parser;