'use strict';
const fs = require('fs-extra');
const path = require('path');
const configPath = process.cwd() + '/padplus.config.json';
const htmlTemplatePath = path.join(__dirname, '../templates/public') + '/index.html';
const hbsfy = require('hbsfy');
const browserifycss = require('browserify-css');
const colors = require('colors');
const cheerio = require('cheerio');
var bundleFiles = [], $, html, config;

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
    var modified = currentPlugin.modifyHtml($, config);
    if (typeof modified != 'undefined') {
      $ = modified;
    }
  }

  if (typeof currentPlugin.clientJs != 'undefined')
    bundleFiles.push(currentPlugin.clientJs);

  if (index == config.plugins.length - 1) {
    $('*').each(function(i, elem){
      $(this).attr('extend', '');
    });
    $('html').append('HEEEY!');
    fs.outputFileSync(process.cwd() + '/webserver/public/index.html', $.html().replace(/ extend=""/g, ""));
    console.log('Bundled HTML');
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
  config = fs.readJsonSync(configPath);
  html = fs.readFileSync(htmlTemplatePath, 'utf8');
  $ = cheerio.load(html, {
    decodeEntities: false,
    normalizeWhitespace: true,
  });
  var cdn = '';
  config.plugins.forEach(handleBundle);
};
