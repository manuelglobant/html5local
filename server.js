/*global require, __dirname, console*/ 
'use strict';
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

// esta request es la que usa el cliente
// para determinar si esta conectado a o no
app.get('/connection-test', function(req, res) {
  res.status(204).send();
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Puerto 3000');
});