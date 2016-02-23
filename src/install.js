const installPlugin = require('./installPlugin.js');
var loglevel = 'error';

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
