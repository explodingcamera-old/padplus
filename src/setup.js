const colors = require('colors');
const fs = require('fs-extra');
const extfs = require('extfs');
const yesno = require('yesno');
const download = require('download-git-repo');
const installPlugin = require('./installPlugin.js');
const exec = require('child_process').exec;
const loglevel = 'error';
const bundle = require('./bundle');

Object.prototype.extend = function (obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      this[i] = obj[i];
    }
  }
};

//TODO: If config exists, extend it with the Template

var ConfigTemplate = {
  version: '0.0.1',
  plugins: [],
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

var checkForMP = function () {
  if (!fs.readdirSync(process.cwd()).length == false) {
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
  download('musiqpad/mqp-server', process.cwd(), function (err) {
    if (err) {
      console.log(colors.red('Error: ') + err);
      process.exit();
    } else {
      exec('npm install', { cwd: (process.cwd()) },
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
  var data;
  try {
    var data = fs.readJsonSync(process.cwd() + '/padplus.config.json');
  } catch (err) {
    data = ConfigTemplate;
  }

  console.log(data);

  fs.outputJsonSync(process.cwd() + '/padplus.config.json', data);
  console.log('Created Config!');
  data.plugins.forEach(function (e, index) {
      console.log('Installing ' + e);
      installPlugin(e, 'plugin', loglevel, function () {
        if (index == data.plugins.length - 1) {
          console.log('Everything was succesfully installed!');
          bundle();
          process.exit();
        }
      });
    });
};
