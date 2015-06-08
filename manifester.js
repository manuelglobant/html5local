'use strict';
/*global require, console*/
var fs = require('fs');

var manifest = {
  dir: 'manifest.appcache',
  encoding: 'utf8'
};

fs.readFile(manifest.dir, manifest.encoding, function (err, data) {
  if (err) {
    return console.log(err);
  }
  
  // var result = data.replace(/index/g, 'indexer');

  
  // var randVersion = Math.round(Math.random() * 1000 + 1);
  var newVersion = data.substr(3);
  console.log(newVersion);

  // fs.writeFile(manifest.dir, result, manifest.encoding, function (err) {
  //    if (err) return console.log(err);
  // });
});