/*global require, __dirname, console*/ 
'use strict';

var nano = require('nano')('http://localhost:5984');
var express = require('express');
var bodyParser = require('body-parser');
var posterApp = require('express')();

posterApp.use(express.static(__dirname + '/public'));
posterApp.use(bodyParser.json());
posterApp.use(bodyParser.urlencoded({ extended: true}));
posterApp.get('/', function (req, res) {
  res.sendFile('index.html');
});

var posterDb = nano.db.use('posts');

if (!posterDb) {
  nano.db.create('posts', function(err) {
    if (err) throw err;
    posterDb = nano.db.use('posts');
  });
}

posterApp.listen(8000, function() {
  console.log('listening on *:8000');
});


