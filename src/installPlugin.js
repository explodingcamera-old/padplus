const npmi = require('npmi');
const fs = require('fs-extra');
const configpath = process.cwd() + '/padplus.config.json';

module.exports = function (module, type, loglevel, cb) {
  if (type == 'plugin')
    if (module.indexOf('mqp-plugin') == -1 && module.indexOf('/') == -1)
      module = 'mqp-plugin-'.concat(module);
  var options = {
    name: module,
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
      var config = fs.readJsonSync(configpath);
      if (config.plugins.indexOf(module) == -1)
      config.plugins.push(module.replace('mqp-plugin-', ''));
      fs.writeJSON(configpath, config);
      console.log('PadPlus-Config updated!');
    }

    if (typeof cb !== 'undefined')
      cb();
    return;
  });
};
