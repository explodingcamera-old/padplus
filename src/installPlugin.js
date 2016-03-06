const fs = require('fs-extra');
const configPath = process.cwd() + '/padplus.config.json';
const exec = require('child_process').exec;
const colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  info: 'cyan',
  prompt: 'white',
  data: 'grey',
  error: 'red',
});

module.exports = function (extension, type, loglevel, cb) {
  var updateConfig = function () {
    if (extension.indexOf('padplus-plugin') != -1 && extension.indexOf('/') == -1)
    extension = extension.replace('padplus-plugin-', '');
    if (type == 'plugin') {
      var config = fs.readJsonSync(configPath);
      if (config.plugins.indexOf(extension) == -1)
      config.plugins.push(extension);
      fs.writeJsonSync(configPath, config);
      console.log('PadPlus-Config updated!'.info);
    }

    if (typeof cb !== 'undefined')
      cb();
    return;
  };

  if (type == 'plugin')
    if (extension.indexOf('padplus-plugin-') == -1 && extension.indexOf('/') == -1)
      extension = 'padplus-plugin-'.concat(extension);
  exec('npm install ' + extension, { cwd: (process.cwd()) },
    (error, stdout, stderr) => {
      if (error !== null) {
        console.log(`ERROR: ${error}`.error);
      }

      updateConfig();
    });
};
