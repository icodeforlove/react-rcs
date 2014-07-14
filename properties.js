'use strict';

/**
 * Manages css property/value transforms.
 */
var propertyTransforms = [],
	prefixedProperties = [],
	baseUrl = '';

function registerProperty (property, transform) {
	propertyTransforms.push({property: property, method: transform});
}

function registerStandardPrefixedProperties (properties) {
	properties.forEach(function (property) {
		prefixedProperties[property] = true;
	});
}

function standardTransform (name, value) {
	return [
		{name: '-webkit-' + name, value: value},
		{name: '-ms-' + name, value: value},
		{name: '-moz-' + name, value: value},
		{name: '-o-' + name, value: value},
		{name: name, value: value}
	];
}

function transform (name, value) {
	var results = [];

	propertyTransforms.forEach(function (transform) {
		if (!name.match(transform.property)) {
			return;
		}

		var transforms = transform.method(name, value);
		
		if (transforms) {
			results = results.concat(transforms);
		}
	});

	if (!results.length) {
		if (prefixedProperties[name]) {
			return standardTransform(name, value);
		} else {
			results.push({name: name, value: value});
		}
	}

	return results;
}

// handle all properties that support url
registerProperty(/^(?:list-style|list-style-image|content|cursor|border-image|border-image-source|background|background-image|src)$/, function (name, value) {
	var matches = value.match(/url\(['"]?(.+?)['"]?\)/);

	if (!matches || !baseUrl) {
		return;
	}

	var url = matches[1],
		newUrl = baseUrl + url;

	return {
		name: name,
		value: value.replace(url, newUrl)
	};
});

exports.setBaseUrl =  function (url) {
	baseUrl = url;
};
exports.transform = transform;
exports.registerProperty = registerProperty;
exports.registerStandardPrefixedProperties = registerStandardPrefixedProperties;