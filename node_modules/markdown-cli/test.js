import childProcess from 'child_process';
import test from 'ava';
const pkg = require('./package.json');

const output = `# markdown-cli

👍  Wohoo!

`;

test('main', t => {
	childProcess.execFile('./cli.js', ['fixture.md', '--no-color'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.is(stdout, output);
	});
});

test('stdin', t => {
	childProcess.exec('cat fixture.md | ./cli.js --no-color', {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.is(stdout, output);
	});
});

test('show help screen', t => {
	childProcess.execFile('./cli.js', ['--help'], (err, stdout) => {
		t.ifError(err);
		t.assert(/Output markdown to CLI/.test(stdout), stdout);
	});
});

test('show version', t => {
	const regex = new RegExp(pkg.version);

	childProcess.execFile('./cli.js', ['--version'], (err, stdout) => {
		t.ifError(err);
		t.assert(regex.test(stdout), stdout);
	});
});
