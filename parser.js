'use strict';

var jsonlint = require('./jsonlint');

// node doesnt support atob/btoa
var atob = typeof atob === 'undefined' && typeof Buffer !== 'undefined' ? function atob (string) {
	return new Buffer(string, 'base64').toString('utf8');
} : atob;
var btoa = typeof btoa === 'undefined' && typeof Buffer !== 'undefined' ? function (string) {
	return new Buffer(string).toString('base64');
} : btoa;

var variableRegExp = /\$([a-z0-9\-_]+)/ig,
	singleVariableRegExp = /\$([a-z0-9\-_]+)/i,
	variableDefineRegExp = /\$([a-z0-9\-_]+): ([^;]+);/ig,
	functionDefinitionRegExp = /\@define ([a-z0-9\-_]+) \(([^\(\)]+)\) \$\{\{([\s\S]+)\}\}\$/,
	codeRegExp = /\$\{\{([\s\S]+)\}\}\$/igm,
	codeReturnRegExp = /\$\{([^\{\}]+)\}\$/ig,
	functionDefinitionCallRegExp = /\@([a-z0-9\-_]+)\(([^\(\)]+)\)/ig,
	variables = {},
	functions = {};

// ${3 + this.functions.add(4) + 6}$
// ${{

// }}$

function processVariableDefintions (string) {
	return string.replace(variableDefineRegExp, function (string, name, value) {
		var varMatch = value.match(singleVariableRegExp);

		if (varMatch) {
			value = variables[varMatch[1]];
			if (!value) {
				return string;
			}
		}

		if (variables[name] !== undefined) {
			throw new Error('RCS DuplicateVariableDefinition: "$' + name + '" has already been defined');
		}

		variables[name] = value;
		return '';
	});
} 

function processVariables (string) {
	return string.replace(variableRegExp, function (string, name) {
		if (variables[name] === undefined) {
			throw new Error('RCS ReferenceError: "$' + name + '" is not defined');
		}
		return variables[name];
	});
}

function processInlineFunctions (string) {
	return string.replace(codeRegExp, function (string, code) {
		try {
			code = eval('(function () {' +  code + '})').call({
				variables: variables,
				functions: functions
			});
		} catch (error) {
			error.code = code;
			throw error;
		}

		return code;
	});
}

function processInlineReturnFunctions (string) {
	return string.replace(codeReturnRegExp, function (string, code) {
		try {
			code = eval('(function () {return ' + code + '})').call({
				variables: variables,
				functions: functions
			});
		} catch (error) {
			error.code = code;
			throw error;
		}

		return code;
	});
}


function processFunctionDefinitions (string) {
	return string.replace(functionDefinitionRegExp, function (string, name, args, code) {
		if (functions[name] !== undefined) {
			throw new Error('RCS DuplicateFunctionDefinition: "' + name + '" has already been defined');
		}

		try {
			functions[name] = eval('(function () { return function (' + args + ') {' + code + '} })()').bind({
				variables: variables,
				functions: functions
			});
		} catch (error) {
			error.code = code;
			throw error;
		}

		return '';
	});
}

function processFunctionDefinitionCall (string) {
	return string.replace(functionDefinitionCallRegExp, function (string, name, args) {
		args = args.split(',').map(function (arg) {
			arg = arg.trim();

			var number = parseFloat(arg, 10);

			if (number == arg) {
				return number;
			} else {
				return arg;
			}
		});
		
		return functions[name].apply(null, args);
	});
}

/**
 * Parses a RCS string to a JSON object.
 */
function parseRCS (rcs, name) {
	var original = rcs;

	rcs = '{\n' + rcs + '\n}';

	rcs = processFunctionDefinitions(rcs);
	rcs = processVariableDefintions(rcs);
	rcs = processVariables(rcs);
	rcs = processInlineFunctions(rcs);
	rcs = processInlineReturnFunctions(rcs);

	rcs = rcs.replace(/"/g, '\\"');

	// strip comments
	rcs = rcs.replace(/^[\t]+\/\/.+$/gim, '');
	rcs = rcs.replace(/\/\*[\S\s]*?\*\//gim, '');

	// handle properties on the same line (we're kind of cheating here using a \r\n as a placeholder)
	rcs = rcs.replace(/;(?!\s+\n)/, ';\r\n');

	// add quotes
	rcs = rcs.replace(/([\@a-z0-9\-\_\.\:\*\#][a-z0-9\-\_\.\:\s\*\[\]\=\'\"\,\(\)\#]*)(?:\s+)?:\s*(.+);/gi, function (match, name, value) {
		// because were encoding the value there is no reason to escape it
		value = value.replace(/\\"/g, '"');

		// check if property value makes a function definition call
		value = processFunctionDefinitionCall(value);

		// base64 the value because of JSON's inability to support unicode
		value = btoa(value);
		return '"' + name + '":"' + value + '";';
	});
	rcs = rcs.replace(/((?:[\@a-z0-9\-\_\.\:\*\#\>\[\]])(?:[a-z0-9\%\-\_\+\.\:\s\*\[\]\=\'\"\,\(\)\#\\\>\~]+)?)(?:\s+)?([\{\[])/gi, function (match, selector, openingBracket) {
		// couldnt figure out a way to do this in the regexp
		selector = selector.trim();

		// base64 the selector because of JSON's inability to support unicode
		selector = btoa(selector);
		
		return '"' + selector + '": ' + openingBracket;
	});

	// add commas
	rcs = rcs.replace(/\}(?!\s*[\}\]]|$)/g, '},');
	rcs = rcs.replace(/;(?!\s*[\}\]])/g, ',');
	rcs = rcs.replace(/;(?=\s*[\}\]])/g, '');

	// keep line numbers intact
	rcs = rcs.replace(/^\{\n/, '{');
	rcs = rcs.replace(/^\n\}/, '}');
	rcs = rcs.replace(/\r\n/, '');

	try {
		return unencodeObject(jsonlint.parse(rcs));
	} catch (error) {
		
		handleError(error, original, name);
	}
}

function unencodeObject (object) {
	for (var property in object) {
		if (typeof object[property] === 'object') {
			var decodedProperty = atob(property);
			object[decodedProperty] = object[property];
			delete object[property];

			object[decodedProperty] = unencodeObject(object[decodedProperty]);
		} else if (typeof object[property] === 'string') {
			object[property] = atob(object[property]);
		}
	}

	return object;
}

function handleError(error, original, name) {
	/*
	 * This is a little hacky but does provide very accurate syntax errors with little effort.
	 */
	var message = '',
		line = parseInt(error.message.match(/Parse error on line (\d+):/)[1], 10),
		lines = original.split('\n');

	// ensure that we actually have the line
	while (lines.length - 1 < line && line >= 0) {
		line--;
	}

	if (name) {
		message += 'Parse error on line ' + line + ' for "' + name + '":\n';
	} else {
		message += 'Parse error on line ' + line + ':\n';
	}

	// show current and previous lines
	for (var i = 5; i >= 0; i--) {
		if (line - i >= 0 && lines[line-i] && lines[line-i].trim()) {
			message += lines[line-i] + '\n';
		}
	}

	// add carrot
	var leadingSpaces = lines[line].match(/^(\s*)/)[1].length;
	for (i = 0; i < leadingSpaces; i++) {
		message += '-';
	}
	message += '^\n';

	// show next lines
	for (i = 1; i <= 5; i++) {
		if (line + i >= 0 && lines[line+i] && lines[line+i].trim()) {
			message += lines[line+i] + '\n';
		}
	}

	// add reason
	message += error.message.split('\n').pop();

	throw new Error(message);
}

exports.variables = variables;
exports.functions = functions;
exports.parseRCS = parseRCS;