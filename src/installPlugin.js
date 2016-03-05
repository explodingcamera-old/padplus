const npmi = require('npmi');
const fs = require('fs-extra');
const configPath = process.cwd() + '/padplus.config.json';
const exec = require('child_process').exec;

module.exports = function (extension, type, loglevel, cb) {
  var installPadPlus = function () {
    if (extension.indexOf('padplus-plugin') != -1 && extension.indexOf('/') == -1)
    extension = extension.replace('padplus-plugin-', '');
    if (type == 'plugin') {
      var config = fs.readJsonSync(configPath);
      console.log(extension);
      if (config.plugins.indexOf(extension) == -1)
      config.plugins.push(extension);
      fs.writeJsonSync(configPath, config);
      console.log('PadPlus-Config updated!');
    }

    if (typeof cb !== 'undefined')
    cb();
    return;
  };

  if (type == 'plugin')
    if (extension.indexOf('padplus-plugin-') == -1 && extension.indexOf('/') == -1)
      extension = 'padplus-plugin-'.concat(extension);
  exec('npm install' + extension, { cwd: (process.cwd()) },
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }

      console.log('Succesfully installed all dependencies of MusiqPad');
      console.log('Now installing PadPlus');
      installPadPlus();
    });
};
