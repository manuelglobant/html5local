/*global require, __dirname, console*/ 
'use strict';

var express = require('express');
var posterApp = require('express')();

posterApp.use(express.static(__dirname + '/public'));

posterApp.get('/', function (req, res) {
  res.sendFile('index.html');
});

posterApp.listen(8000, function() {
  console.log('listening on *:8000');
});


