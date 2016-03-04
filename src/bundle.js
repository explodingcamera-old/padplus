const fs = require('fs-extra');
const path = require('path');
const configPath = process.cwd() + '/padplus.config.json';
const setupHtml = require('./bundle/changeHtml');
const hbsfy = require('hbsfy');
const browserifycss = require('browserify-css');
var bundleFiles = [];
var config, $;

var handleBundle = function (plugin, index) {
  if (plugin.indexOf('/') > -1)
    plugin = plugin.split('/')[1];

  var currentPlugin = require(process.cwd() + '/node_modules/' + plugin);
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
  $ = setupHtml();
  config = fs.readJsonSync(configPath);
  config.plugins.forEach(handleBundle);
};
