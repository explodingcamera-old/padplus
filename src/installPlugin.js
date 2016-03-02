const npmi = require('npmi');
const fs = require('fs-extra');
const configPath = process.cwd() + '/padplus.config.json';

module.exports = function (extension, type, loglevel, cb) {
  if (type == 'plugin')
    if (extension.indexOf('mqp-plugin') == -1 && extension.indexOf('/') == -1)
      extension = 'mqp-plugin-'.concat(extension);
  var options = {
    name: extension,
    path: process.cwd(),
    forceInstall: false,
    npmLoad: {
      loglevel: loglevel,
    },
  };

  npmi(options, function (err, result) {
    if (err) {
      if (err.code === npmi.LOAD_ERR)    console.log('npm load error');
      else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
      return console.log(err.message);
    }

    if (type == 'plugin') {
      var config = fs.readJsonSync(configPath);
      if (config.plugins.indexOf(extension) == -1)
      config.plugins.push(extension.replace('mqp-plugin-', ''));
      fs.writeJsonSync(configPath, config);
      console.log('PadPlus-Config updated!');
    }

    if (typeof cb !== 'undefined')
      cb();
    return;
  });
};
