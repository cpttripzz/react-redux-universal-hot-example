var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');
export function download(uri, directoryName, filename, callback) {
  mkdirp(directoryName)
  // make the filename not need a directory
  //var file = filename.split('/')[filename.split('/').length - 1];

  request.head(uri, function(err, res, body) {
    var r = request(uri).pipe(fs.createWriteStream(directoryName + '/' +filename));
    r.on('close', callback);
    r.on('error', function(message) { console.log(message)});
  });
};

export function existsSync(filePath){

    try{
      fs.statSync(filePath);
    }catch(err){
      if(err.code == 'ENOENT') return false;
    }
    return true;
  };