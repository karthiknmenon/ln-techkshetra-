'use strict';
const chalk = require('chalk');
const Table = require('cli-table');
const utils = require('./utils');
const cache = new Map();

class Renderer {
	constructor(options) {
		this.cli = options;
	}
	code(text) {
		const flow = utils.compose(
			utils.highlight,
			utils.indent,
			text => utils.wrapAnsi(text, this.cli.width, {hard: this.cli.hard}),
			utils.padding
		);

		return flow(text);
	}
	paragraph(text) {
		const flow = utils.compose(
			utils.unescape,
			utils.emoji,
			text => utils.wrapAnsi(text, this.cli.width, {hard: this.cli.hard}),
			utils.padding
		);

		const output = flow(text);
		cache.set(output, {text, level: 0});

		return output;
	}
	blockquote(text) {
		const input = cache.get(text);
		const level = input.level + 1;

		const flow = utils.compose(
			utils.unescape,
			utils.emoji,
			text => utils.wrapAnsi(text, this.cli.width - (2 * level), {hard: this.cli.hard}),
			text => utils.indentString(text, level, `${chalk.grey('|')} `),
			utils.padding
		);

		const output = flow(input.text);
		cache.set(output, {text: input.text, level});

		return output;
	}
	html(text) {
		const flow = utils.compose(
			utils.unescape,
			utils.emoji
		);
		return flow(text);
	}
	heading(text, level) {
		const flow = utils.compose(
			utils.unescape,
			utils.emoji,
			text => `${'#'.repeat(level)} ${text}`,
			chalk.red.bold,
			text => utils.wrapAnsi(text, this.cli.width, {hard: this.cli.hard}),
			utils.padding
		);
		const output = flow(text);
		return output;
	}
	hr() {
		const flow = utils.compose(chalk.reset, utils.padding);
		const output = '-'.repeat(this.cli.width);
		return flow(output);
	}
	list(text) {
		const flow = utils.compose(
			utils.unescape,
			utils.emoji,
			text => utils.indentString(text, 2, ' '),
			text => text.replace(/\n+/g, '\n'),
			text => utils.wrapList(text, this.cli.width, {hard: this.cli.hard}),
			utils.padding
		);

		const output = flow(text);
		return output;
	}
	listitem(text) {
		const wrap = utils.compose(
			text => `\n- ${text}`
		);

		return wrap(text);
	}
	table(header, body) {
		const flow = utils.compose(
			utils.unescape,
			utils.emoji
		);

		const table = new Table({
			head: utils.generateTableRow(header, flow)[0]
		});

		utils.generateTableRow(body, flow).forEach(row => {
			table.push(row);
		});

		return utils.padding(table.toString());
	}
	tablerow(text) {
		return `${utils.TABLE_ROW_WRAP}${text}${utils.TABLE_ROW_WRAP}
`;
	}
	tablecell(text) {
		return text + utils.TABLE_CELL_SPLIT;
	}
	strong(text) {
		return chalk.bold(text);
	}
	em(text) {
		return chalk.italic(text);
	}
	text(text) {
		return text;
	}
	codespan(text) {
		const flow = utils.compose(
			utils.unescape,
			chalk.inverse
		);

		return flow(text);
	}
	br() {
		return '\n';
	}
	del(text) {
		return text;
	}
	link(href, title, text) {
		const hasText = text && text !== href;
		return (hasText) ? `${chalk.blue(utils.emoji(text))} (${chalk.magenta(href)})` : chalk.magenta(href);
	}
	image(href, title, text) {
		return (title) ? `![${chalk.blue(text)} – ${chalk.blue(title)}](${chalk.magenta(href)})` : `![${chalk.blue(text)}](${chalk.magenta(href)})`;
	}

}

module.exports = Renderer;
