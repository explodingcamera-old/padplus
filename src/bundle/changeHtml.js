const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const configPath = process.cwd() + '/padplus.config.json';
const htmlPath = process.cwd() + '/public/index.html';
const htmlTemplatePath = path.join(__dirname, '../../templates/public') + '/index.html';
var config;

module.exports = function () {
  config = fs.readJsonSync(configPath);
  var html = fs.readFileSync(htmlTemplatePath, 'utf8');
  var $ = cheerio.load(html);

  var cdn = '';
  if (config.useCDN == true)
  cdn = config.cdnUrl;
  $('script[src="/pads/lib/js/app.js"]').attr('src', cdn + '/lib/js/app.js');  //TODO: Paths need to be changed when the source code becomes avalible
  $('body').append('<script src="/lib/js/padplus.js"></script>');
  return $;
};
