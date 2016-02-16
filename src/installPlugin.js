var npmi = require('npmi');


module.exports = function (module) {
  var options = {
      name: module,    // your module name
      path: process.cwd(),              // installation path [default: '.']
      forceInstall: false,    // force install if set to true (even if already installed, it will do a reinstall) [default: false]
      npmLoad: {              // npm.load(options, callback): this is the "options" given to npm.load()
          loglevel: 'info'  // [default: {loglevel: 'silent'}]
      }
  };
  npmi(options, function (err, result) {
      if (err) {
          if      (err.code === npmi.LOAD_ERR)    console.log('npm load error');
          else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
          return console.log(err.message);
      }

      var file_content = fs.readFileSync(filename);
      fs.writeFileSync(filename, JSON.stringify(content));
      console.log(options.name+'@'+options.version+' installed successfully in '+path.resolve(options.path));
  });
}
