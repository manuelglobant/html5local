'use strict';
/*global require, console*/
var fs = require('fs');

var manifest = {
  dir: 'manifest.appcache',
  encoding: 'utf8'
};

var update = function () {
  fs.readFile(manifest.dir, manifest.encoding, function (err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split('\n');
    data[2] = '#' + new Date().toISOString();
    data = data.join('\n');
    var result = data;

    fs.writeFile(manifest.dir, result, manifest.encoding, function (err) {
      if (err) return console.log(err);
    });
  });
};

setInterval(function(){
  update();
}, 100);