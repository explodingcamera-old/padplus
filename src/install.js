const installPlugin = require('./installPlugin.js');
const loglevel = 'error';
const fs = require('fs-extra');
const configPath = process.cwd() + '/padplus.config.json';
const bundle = require('./bundle');
const exec = require('child_process').exec;

var tmp = 0;

module.exports = function (plugins) {
  try {
    fs.statSync(configPath);
  } catch (err) {
    if (err.code == 'ENOENT')
    console.log('ERROR: NO CONFIG FILE! Run padplus setup first or change the current dir.');
    process.exit();
  }

  var config = fs.readJsonSync(configPath);

  // TODO: Install Plugins from Config
  if (typeof plugins == 'undefined') {
    console.log('No Plugins provided, installing from config');
  } else
    plugins.forEach(function (plugin, index) {
      x = installPlugin(plugin, 'plugin', loglevel, function () {
        console.log('Installed ' + plugin);
        console.log(index + ' ' + plugins.length);
        tmp++;
        if (tmp == plugins.length) {
          console.log('All Plugins are now Installed! Now Bundling!');
          bundle();
        }
      });
    });
};
