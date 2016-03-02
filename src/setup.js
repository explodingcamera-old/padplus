const colors = require('colors');
const fs = require('fs-extra');
const extfs = require('extfs');
const yesno = require('yesno');
const download = require('download-git-repo');
const installPlugin = require('./installPlugin.js');
const exec = require('child_process').exec;
const loglevel = 'error';
var ConfigTemplate = {
  version: '0.0.1',
  plugins: [
    'explodingcamera/musiqplus',
  ],
  useCDN: false,
  cdnUrl: 'https://explodingcamera.xyz/padplus',
  __PadPlusCDN: '//Up to 200.000 requests/month per domain',
};

module.exports = function (options) {
  if (typeof options.type == 'undefined') {
    console.log(colors.green('No type provided, using default (full)'));
    console.log();
    options.type = 'full';
  }

  checkForMP();
};

var dirIsEmpty = function () {
  var isEmpty = 0;
  extfs.isEmpty(process.cwd(), function (empty) {
    isEmpty = empty;
  });

  return isEmpty;
};

var checkForMP = function () {
  if (dirIsEmpty() == false) {
    console.log("MusiqPad is already installed or the dir isn't empty.");
    yesno.ask('Are you sure you want to continue? (Y/n)', true, function (ok) {
      if (ok) {
        yesno.ask('Do you want to (re)install MusiqPad? (Y/n)', true, function (ok2) {
          if (ok2) {
            dlMusiqPad();
          } else {
            installPadPlus();
          }
        });
      } else {
        process.exit();
      }
    });

  }  else {
    dlMusiqPad();
  }
};

var dlMusiqPad = function () {
  console.log('Downloading MusiqPad');
  download('musiqpad/mqp-server', process.cwd() + '/musiqpad'/* <- text is just for testing, will be removed at beta release*/, function (err) {
    if (err) {
      console.log(colors.red('Error: ') + err);
      process.exit();
    } else {
      exec('npm install', { cwd: (process.cwd() + '/musiqpad') },  /* <- text is just for testing, will be removed at beta release*/
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
    }
  });
};

var installPadPlus = function () {
  fs.outputJsonSync(process.cwd() + '/padplus.config.json', ConfigTemplate);
  console.log('Created Config!');
  ConfigTemplate.plugins.forEach(function (e, index) {
      console.log('Installing ' + e);
      installPlugin(e, 'plugin', loglevel, function () {
        if (index == ConfigTemplate.plugins.length - 1) {
          console.log('Everything was succesfully installed!');
          process.exit();
        }
      });
    });
};
