var npmi = require('npmi');
var fs = require('fs');

module.exports = function (module) {
  if(module.indexOf("padplus-plugin") == -1 && module.indexOf("/") == -1){
    module = "padplus-plugin-".concat(module);
  }
  var options = {
      name: module,
      path: process.cwd(),
      forceInstall: false,
      npmLoad: {
          loglevel: 'info'
      }
  };
  npmi(options, function (err, result) {
      if (err) {
          if      (err.code === npmi.LOAD_ERR)    console.log('npm load error');
          else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
          return console.log(err.message);
      }

      module.replace("padplus-plugin-", "");
      fs.readFile(process.cwd()+"/padplus.config.json", function read(err, data) {
          if (err) {
              throw err;
          }
          processConfig(data);
      });
      var processConfig = function (content) {
        content = JSON.parse(content);
        if(content.plugins.indexOf(module) == -1)
        content.plugins.push(module);
        fs.writeFile(process.cwd()+"/padplus.config.json", JSON.stringify(content, null, 4), function(err) {
          console.log(options.name+'@'+options.version+' installed successfully in '+ options.path);
        });
      }
 });
}
