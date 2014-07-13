'use strict';

var toHyphenDelimited = require('../utils/toHyphenDelimited');

function addPrefixToClassName (prefix, className) {
	return prefix + '-' + toHyphenDelimited(className);
}

function addClassPrefixToClassString (prefix, classString) {
	return classString.split(' ').map(function (className) {
		return addPrefixToClassName(prefix, className);
	}).join(' ');
}

function addClassPrefixToNode (node, displayName, _isChild) {		
	if (!node || !node.props) {
		return;
	}

	var props = node.props,
		prefix = 'react-' + toHyphenDelimited(displayName);

	if (props.class) {
		// precompute class names
		props.class = props.class.split(' ').map(function (className) {
			// replace state shorthand
			className = className.replace(/^\:\:\:/, 'state-');
			return className;
		}).join(' ');
	}

	// modify class strings
	if (props.class && !_isChild) {
		props.class = ['react-view', prefix, addClassPrefixToClassString(prefix, props.class)].join(' ');
	} else if (props.class && _isChild) {
		props.class = addClassPrefixToClassString(prefix, props.class);
	} else if (!props.class && !_isChild) {
		props.class = 'react-view ' + prefix;
	}

	// add to className
	if (props.className && props.class) {
		props.className += ' ' + props.class;
	} else if (!props.className && props.class) {
		props.className = props.class;
	}
	delete props.class;

	if (typeof props.children === 'string') {
		return;
	}

	// traverse children
	if (Array.isArray(props.children)) {
		props.children.forEach(function (node) {
			addClassPrefixToNode(node, displayName, true);
		});
	} else if (typeof props.children === 'object') {
		addClassPrefixToNode(props.children, displayName, true);
	} else if (props.children && props.children._store) {
		addClassPrefixToNode(props.children, displayName, true);
	}
}

exports.addClassPrefixToNode = addClassPrefixToNode;