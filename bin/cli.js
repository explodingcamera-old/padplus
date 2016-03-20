#!/usr/bin/env node

const program = require('commander');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');
const eol = os.EOL;
const pkg = require('../package.json');
const configPath = process.cwd() + '/padplus.config.json';

const bundle = require('../src/bundle.js');
const setup = require('../src/setup.js');
const installPlugins = require('../src/install.js');
const update = require('../src/update');
const version = pkg.version;

const request = require('request');
request('https://explodingcamera.xyz/padplus/version.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    data = JSON.parse(body);
    if (data.version != version) {
      console.log();
      console.log(data.msg);
      console.log();
    }
  }
});

program
	.usage('<command> [options]')
  .version(version);

program.on('--help', function () {
  console.log('  To get additionaly help + options for a command, do');
  console.log();
  console.log('    $ padplus <command> --help');
  console.log('');
});

program
  .command('setup')
	.usage('[options]')
	.option('-T --type <type>', 'Type of installation (full|medium|lite)', /^(full|medium|lite)$/i)
  .action(setup)
	.on('--help', function () {
  console.log('  Examples:');
  console.log();
  console.log('    $ padplus setup light');
  console.log('    $ padplus setup');
  console.log();
	});

program
	.command('install [plugins...]')
  .action(installPlugins)
	.on('--help', function () {
  console.log('  Examples:');
  console.log();
  console.log('    $ padplus install //installs all plugins from padplus.config.json');
  console.log('    $ padplus install contrib-');
  console.log();
	});

	program
		.command('bundle')
		.action(bundle)
		.on('--help', function () {
  console.log('  Examples:');
  console.log();
  console.log('    $ padplus bundel //bundles all plugins from padplus.config.json');
  console.log();
});

program
  .command('update')
  .action(update)
	.on('--help', function () {
  console.log('  Examples:');
  console.log();
  console.log('    $ padplus update');
  console.log();
	});

program.parse(process.argv);

if (!program.args.length) {
  program.outputHelp(colors.cyan);
}
