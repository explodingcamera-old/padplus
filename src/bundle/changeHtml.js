const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const configPath = process.cwd() + '/padplus.config.json';
const htmlPath = process.cwd() + '/public/index.html';
const htmlTemplatePath = path.join(__dirname, '../../templates/public') + '/index.html';
const config = fs.readJsonSync(configPath);

console.log(config);

var html = fs.readFileSync(htmlTemplatePath, 'utf8');
var $ = cheerio.load(html);

var cdn = '';
if (config.useCDN == true)
  cdn = config.cdnUrl;

module.exports = function () {
  $('script[src="/pads/lib/js/app.js"]').attr('src', cdn + '/lib/js/app.js');
  $('body').append('<script src="' + cdn + '/lib/js/padplus.js"></script>');
  return $;
};
