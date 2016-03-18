const colors = require('colors');
const fs = require('fs-extra');
const extfs = require('extfs');
const yesno = require('yesno');
const download = require('download-git-repo');
const installPlugin = require('./installPlugin.js');
const exec = require('child_process').exec;
const loglevel = 'error';
const bundle = require('./bundle');
const pkg = require('../package.json');
colors.setTheme({
  silly: 'rainbow',
  info: 'cyan',
  prompt: 'white',
  data: 'grey',
  error: 'red',
});

Object.prototype.extend = function (obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      this[i] = obj[i];
    }
  }
};

//TODO: If config exists, extend it with the Template (Sortof already done)

var ConfigTemplate = {
  version: pkg.version,
  plugins: [],
  useCDN: false,
  cdnUrl: 'https://explodingcamera.xyz/padplus',
  __PadPlusCDN: '//Up to 200.000 requests/month per domain',
};

module.exports = function (options) {
  if (typeof options.type == 'undefined') {
    console.log(colors.green('No type provided, using default (full)'.info));
    options.type = 'full';
  }

  checkForMP();
};

var checkForMP = function () {
  if (!fs.readdirSync(process.cwd()).length == false) {
    console.log("MusiqPad is already installed or the dir isn't empty.".info);
    yesno.ask('Are you sure you want to continue? (Y/n)'.prompt, true, function (ok) {
      if (ok) {
        yesno.ask('Do you want to (re)install MusiqPad? (Y/n)'.prompt, true, function (ok2) {
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
  console.log('Downloading MusiqPad'.info);
  download('musiqpad/mqp-server', process.cwd(), function (err) {
    if (err) {
      console.log(colors.red('Error: '.error) + err);
      process.exit();
    } else {
      console.log('Download finished, now installing dependencies'.info);
      console.log('This step might take some time ...'.info);
      exec('npm install', { cwd: (process.cwd()) },
        (error, stdout, stderr) => {
          console.log('Succesfully installed all dependencies of MusiqPad'.info);
          console.log('Now installing PadPlus...'.info);
          installPadPlus();
        });
    }
  });
};

var installPadPlus = function () {
  var data;
  try {
    var data = fs.readJsonSync(process.cwd() + '/padplus.config.json');
  } catch (err) {
    data = ConfigTemplate;
  }

  if (data.plugins.indexOf('api') == -1)      //  TODO: PADPLUS API
    data.plugins.push('api');
  data.version = ConfigTemplate.version;
  fs.outputJsonSync(process.cwd() + '/padplus.config.json', data);
  console.log('Created Config!'.info);
  data.plugins.forEach(function (e, index) {
      console.log('Installing '.info + e);
      installPlugin(e, 'plugin', loglevel, function () {
        if (index == data.plugins.length - 1) {
          console.log('Everything was succesfully installed!'.info);
          bundle();
          process.exit();
        }
      });
    });
};
