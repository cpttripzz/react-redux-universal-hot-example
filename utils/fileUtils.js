var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');
export function download(uri, directoryName, filename, callback) {
  console.log(uri, filename);
  mkdirp(directoryName)
  // make the filename not need a directory
  //var file = filename.split('/')[filename.split('/').length - 1];

  request.head(uri, function(err, res, body) {

    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    var r = request(uri).pipe(fs.createWriteStream(directoryName + '/' +filename));
    r.on('close', callback);
    r.on('error', function(message) { console.log(message)});
  });
};