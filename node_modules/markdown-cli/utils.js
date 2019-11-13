'use strict';
/* eslint-disable prefer-reflect */

const chalk = require('chalk');
const emoji = require('node-emoji');
const cardinal = require('cardinal');
const flow = require('lodash.flow');
const unescape = require('lodash.unescape');
const trimEnd = require('lodash.trimend');
const trimStart = require('lodash.trimstart');
const indentString = require('indent-string');
const wrapAnsi = require('wrap-ansi');

const TABLE_CELL_SPLIT = '^*||*^';
const TABLE_ROW_WRAP = '*|*|*|*';
const TABLE_ROW_WRAP_REGEXP = new RegExp(escapeRegExp(TABLE_ROW_WRAP), 'g');

module.exports = {
	escapeRegExp,
	unescape,
	generateTableRow,
	highlight,
	padding,
	compose: flow,
	emoji: insertEmojis,
	indent: text => indentString(text, 2, ' '),
	indentString,
	trimEnd,
	trimStart,
	wrapLine: wrapAnsi,
	wrapList: (text, cols, opts) => {
		const input = text.split('\n');

		const result = input.map(line => {
			const regex = /^((\s*)?-\s+)/.exec(line);
			let output = line;
			if (regex !== null) {
				const level = (regex[0].length || 0);
				const lineWidth = cols - level - 2;
				const compose = flow(
					line => trimStart(line, regex[0]),
					line => wrapAnsi(line, lineWidth, opts),
					line => indentString(line, level, ' '),
					line => trimStart(line),
					line => `${regex[0]}${line}`
				);

				output = compose(line);
			}

			return output;
		}).join(`\n`);

		return result;
	},
	wrapAnsi: (text, cols, opts) => text.split('\n').map(line => wrapAnsi(line, cols, opts)).join('\n'),
	TABLE_CELL_SPLIT,
	TABLE_ROW_WRAP,
	TABLE_ROW_WRAP_REGEXP
};

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function generateTableRow(text, transform) {
	if (!text) {
		return [];
	}

	const data = [];

	transform(text).split('\n').forEach(line => {
		if (!line) {
			return;
		}
		const parsed = line.replace(TABLE_ROW_WRAP_REGEXP, '').split(TABLE_CELL_SPLIT);

		data.push(parsed.splice(0, parsed.length - 1));
	});

	return data;
}

function highlight(code) {
	if (!chalk.enabled) {
		return chalk.green(code);
	}

	try {
		return cardinal.highlight(code);
	} catch (e) {
		return chalk.green(code);
	}
}

function padding(text) {
	return `${text}

`;
}

function insertEmojis(text) {
	return text.replace(/:([A-Za-z0-9_\-\+]+?):/g, emojiString => {
		const emojiSign = emoji.get(emojiString);
		return (!emojiSign) ? emojiString : `${emojiSign} `;
	});
}
