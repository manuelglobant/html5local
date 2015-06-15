'use strict';
/*global require, console*/

var fs = require('fs');

var manifest = {
  dir: process.argv[2] || 'manifest.appcache',
  content: undefined
};

var update = function () {
  fs.readFile(manifest.dir, 'utf8', function (err, data) {
    if (err) return console.log(err);

    manifest.content = data;
    manifest.content = manifest.content.split('\n');
    manifest.content[2] = '#' + new Date().toISOString();
    manifest.content = manifest.content.join('\n');

    fs.writeFile(manifest.dir, manifest.content, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
};

setInterval(update, process.argv[3] || 1000);