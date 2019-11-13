#!/usr/bin/env node
/* eslint-disable no-mixed-spaces-and-tabs */
'use strict';
const fs = require('fs');
const meow = require('meow');
const stdin = require('get-stdin');
const updateNotifier = require('update-notifier');
const markdown = require('./');

const cli = meow(`
	Usage
	  $ markdown-cli <file>
    $ echo <string> | markdown-cli
`, {
	string: ['_'],
	boolean: ['hard'],
	alias: {
		w: 'wordwrap',
		v: 'version',
		h: 'help'
	}
});

updateNotifier({pkg: cli.pkg}).notify();

function init(data, count, hard) {
	const output = markdown(data, count, hard);
	process.stdout.write(output);
}

const input = cli.input[0];

if (!input && process.stdin.isTTY) {
	console.error('Expected a filepath');
	process.exit(1);
}

if (input) {
	init(fs.readFileSync(input, 'utf8'), cli.flags.wordwrap, cli.flags.hard);
} else {
	stdin().then(data => init(data, cli.flags.wordwrap, cli.flags.hard));
}
