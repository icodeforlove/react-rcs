'use strict';

/**
 * Parses a RCS string to a JSON object.
 */
function parseRCS (rcs) {
	var original = rcs;

	rcs = '{\n' + rcs + '\n}';
	
	rcs = rcs.replace(/"/g, '\\"');

	// strip comments
	rcs = rcs.replace(/^[\t]+\/\/.+$/gim, '');
	rcs = rcs.replace(/\/\*[\S\s]*?\*\//gim, '');

	// add quotes
	rcs = rcs.replace(/([\@a-z0-9-.:][a-z0-9-.:\s]*)(?:\s+)?:\s*(.+);/gi, '"$1": "$2";');
	rcs = rcs.replace(/([\@a-z0-9-.:][a-z0-9%-.:\s\[\]\=\'\",]*?)(?:\s*)([\{\[])/gi, '"$1": $2');

	// remove unnessary white spaces
	//rcs = rcs.replace(/\n|\t/g, '');

	// default number values to pixels
	//rcs = rcs.replace(/(\d+)(?!\d)(?!%|px)/gi, '$1px');

	// add commas
	rcs = rcs.replace(/\}(?!\s*[\}\]]|$)/g, '},');
	rcs = rcs.replace(/;(?!\s*[\}\]])/g, ',');
	rcs = rcs.replace(/;(?=\s*[\}\]])/g, '');

	try {
		return JSON.parse(rcs);
	} catch (error) {
		throw new Error('Issue Parsing RCS: \noriginal:\n' + original + '\n\nmalformed:\n' + rcs);
	}
}

exports.parseRCS = parseRCS;