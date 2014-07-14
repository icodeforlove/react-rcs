'use strict';

var jsonlint = require('jsonlint/lib/jsonlint');

/**
 * Parses a RCS string to a JSON object.
 */
function parseRCS (rcs, name) {
	var original = rcs;

	rcs = '{\n' + rcs + '\n}';
	
	rcs = rcs.replace(/"/g, '\\"');

	// strip comments
	rcs = rcs.replace(/^[\t]+\/\/.+$/gim, '');
	rcs = rcs.replace(/\/\*[\S\s]*?\*\//gim, '');

	// we're kind of cheating here using a \r\n as a placeholder
	rcs = rcs.replace(/;(?!\s+\n)/, ';\r\n');

	// add quotes
	rcs = rcs.replace(/([\@a-z0-9\-\.\:\*][a-z0-9\-\.\:\s\*]*)(?:\s+)?:\s*(.+);/gi, '"$1": "$2";');
	rcs = rcs.replace(/([\@a-z0-9\-\.\:\*][a-z0-9\%\-\.\:\s\*\[\]\=\'\"\,\(\)]*?)(?:\s*)([\{\[])/gi, '"$1": $2');
	
	// remove unnessary white spaces
	//rcs = rcs.replace(/\n|\t/g, '');

	// default number values to pixels
	//rcs = rcs.replace(/(\d+)(?!\d)(?!%|px)/gi, '$1px');

	// add commas
	rcs = rcs.replace(/\}(?!\s*[\}\]]|$)/g, '},');
	rcs = rcs.replace(/;(?!\s*[\}\]])/g, ',');
	rcs = rcs.replace(/;(?=\s*[\}\]])/g, '');

	// keep line numbers intact
	rcs = rcs.replace(/^\{\n/, '{');
	rcs = rcs.replace(/^\n\}/, '}');
	rcs = rcs.replace(/\r\n/, '');

	try {
		return jsonlint.parse(rcs);
	} catch (error) {
		handleError(error, original, name);
	}
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

exports.parseRCS = parseRCS;