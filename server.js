/*global require, __dirname*/ 
'use strict';
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

app.get('/connection-test', function(req, res) {
  res.status(204).send();
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000);