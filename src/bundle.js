const fs = require('fs-extra');
const path = require('path');
const configPath = process.cwd() + '/padplus.config.json';
const stats = fs.lstatSync(configPath);
const setupHtml = require('./bundle/changeHtml');
const hbsfy = require('hbsfy');
const browserifycss = require('browserify-css');
var $ = setupHtml();
var bundleFiles = [];

if (!stats.isFile()) {
  console.log('ERROR: NO CONFIG FILE! Run padplus setup first or change the current dir.');
  process.exit();
}

const config = fs.readJsonSync(configPath);

var handleBundle = function (plugin, index) {
  if (plugin.indexOf('/') > -1)
    plugin = plugin.split('/')[1];

  var currentPlugin = require(plugin);
  $ = currentPlugin.modifyHtml($, config);

  bundleFiles.push(currentPlugin.clientJs);

  console.log($.html());

  // TODO: Write HTML to file

  if (index == config.plugins.length + 1)
    bundle();
};

var bundle = function () {
  console.log('Now Bundeling client js files');
  var browserify = require('browserify');
  var b = browserify({
    transform: [hbsfy, browserifycss],
    entries: bundleFiles,
    paths: ['./', process.cwd()],
    browserField: false,

    // TODO: Add padplus api file
  });

  b.bundle(function (err, buffer) {
    console.log(err);
    console.log(buffer.toString('utf-8'));
    var js = buffer.toString('utf-8');
  });

  /*bundleFiles.forEach(function (path, index) {
    b.add({
      entries: ""
    })
  });       Will be used if the basedir is a problem */

};

module.exports = function () {
  config.plugins.forEach(handleBundle);
};
