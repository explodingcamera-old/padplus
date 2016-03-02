const installPlugin = require('./installPlugin.js');
const loglevel = 'error';
const fs = require('fs-extra');
const configPath = process.cwd() + '/padplus.config.json';
const config = fs.readJsonSync(configPath);

try {
  fs.statSync(configPath);
} catch (err) {
  if (err.code == 'ENOENT')
  console.log('ERROR: NO CONFIG FILE! Run padplus setup first or change the current dir.');
  process.exit();
}

module.exports = function (plugins) {
  if (typeof plugins == 'undefined') {
    console.log('No Plugins provided, installing from config');

  }

  // Install Plugins from Config
  else
    plugins.forEach(function (plugin, index) {
      console.log('Installed ' + plugin);
      installPlugin(plugin, 'plugin', loglevel, function () {
        if (index == plugins.length - 1)
        console.log(1);
      });
    });
};
