'use strict';

const marked = require('marked');
const TerminalRenderer = require('./renderer');

module.exports = (data, count, hard) => {
	const width = typeof count !== 'undefined' ? count : process.stdout.columns;

	marked.setOptions({
		renderer: new TerminalRenderer({
			width,
			hard
		}),
		gfm: true,
		tables: true,
		breaks: true
	});

	try {
		data = marked(data);
	} catch (e) {
		// console.log(e);
	}

	return data;
};
