const installPlugin = require('./installPlugin.js');
const loglevel = 'error';
const fs = require('fs-extra');
const configPath = process.cwd() + '/padplus.config.json';
const bundle = require('./bundle');
var tmp = 0;
const colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  info: 'cyan',
  prompt: 'white',
  data: 'grey',
  error: 'red',
});

module.exports = function (plugins) {
  try {
    fs.statSync(configPath);
  } catch (err) {
    if (err.code == 'ENOENT')
    console.log('ERROR: NO CONFIG FILE! Run padplus setup first or change the current dir.'.error);
    process.exit();
  }

  var config = fs.readJsonSync(configPath);

  // TODO: Install Plugins from Config
  if (typeof plugins == 'undefined') {
    console.log('No Plugins provided, installing from config isn\'t available yet'.info);
    process.exit();
  } else
    plugins.forEach(function (plugin, index) {
      x = installPlugin(plugin, 'plugin', loglevel, function () {
        console.log('Installed '.info + plugin);
        tmp++;
        if (tmp == plugins.length) {
          console.log('All Plugins are now Installed! Now Bundling!'.info);
          bundle();
        }
      });
    });
};
