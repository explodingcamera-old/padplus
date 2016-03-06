const fs = require('fs-extra');
const path = require('path');
const configPath = process.cwd() + '/padplus.config.json';
const setupHtml = require('./bundle/changeHtml');
const hbsfy = require('hbsfy');
const browserifycss = require('browserify-css');
var bundleFiles = [];
var config, $;
const colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  info: 'cyan',
  prompt: 'white',
  data: 'grey',
  error: 'red',
});

var handleBundle = function (plugin, index) {
  if (plugin.indexOf('/') > -1)
    plugin = plugin.split('/')[1];
  else if (plugin.indexOf('padplus-plugin') == -1 && plugin.indexOf('/') == -1)
    plugin = 'padplus-plugin-'.concat(plugin);

  var currentPlugin = require(process.cwd() + '/node_modules/' + plugin);

  if (typeof currentPlugin.modifyHtml != 'undefined') {
    modified = currentPlugin.modifyHtml($, config);
    if (typeof modified != 'undefined') {
      $ = modified;
    }
  }

  if (typeof currentPlugin.clientJs != 'undefined')
    bundleFiles.push(currentPlugin.clientJs);

  if (index == config.plugins.length - 1) {
    //TODO: Remove that extend stuff
    fs.outputFileSync(process.cwd() + '/webserver/public/index.html', $.html());
    bundle();
  }
};

var bundle = function () {
  console.log('Now Bundeling client js files'.info);
  var browserify = require('browserify');
  var b = browserify({
    transform: [hbsfy, browserifycss],
    entries: bundleFiles,
    paths: ['./', process.cwd()],
    browserField: false,

    // TODO: Add padplus api file
  });

  b.bundle(function (err, buffer) {
    if (err)
      console.log(err);
    var js = buffer.toString('utf-8');
    fs.outputFileSync(process.cwd() + '/webserver/public/lib/js/padplus.js', js);
    console.log('Bundleing complete!'.info);
  });
};

module.exports = function () {
  $ = setupHtml();
  config = fs.readJsonSync(configPath);
  config.plugins.forEach(handleBundle);
};
