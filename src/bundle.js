const fs = require('fs-extra');
const path = require('path');
const configPath = process.cwd() + '/padplus.config.json';
const stats = fs.lstatSync(configPath);
const setupHtml = require('./bundle/changeHtml');

if (!stats.isFile()) {
  console.log('ERROR: NO CONFIG FILE! Run padplus setup first or change the current dir.');
  process.exit();
}

const config = fs.readJsonSync(configPath);
