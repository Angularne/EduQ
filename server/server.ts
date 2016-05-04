/// <reference path="./typings/main.d.ts"/>

import express = require('express');
import logger = require('morgan');
import path = require('path');
import bodyParser = require('body-parser');
import mongoose = require("mongoose");
import socket = require('./api/socket');
import socketio = require("socket.io");
var config = require('../config');
import {QueueSocket} from './api/socket';
//import minimist = require('minimist');
//var argv = minimist(process.argv.slice(2));
//console.log(argv);




var app = express();
//.use(logger('dev'));
//app.use(bodyParser.json());
app.use(express.static(__dirname+"/../../client"));
app.use(express.static(__dirname+"/../../client/node_modules"));
app.use(bodyParser.json({limit: '5mb'}));
//app.use(bodyParser.urlencoded({limit: '5mb', extended: false}));

/** Connect to mongodb */
let mOptions = {
  host: config.mongodb.host || 'localhost',
  port: config.mongodb.port || '27017',
  path: config.mongodb.path || 'queue',
  user: config.mongodb.user || '',
  pass: config.mongodb.pass || ''
}

let uri = 'mongodb://' + mOptions.user + ':' + mOptions.pass + '@' + mOptions.host + ':' + mOptions.port + '/' + mOptions.path
mongoose.connect(uri, (err, res) => {
  if (err) {
    console.error('ERROR connecting to: ' + uri + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uri);
  }
});

/** api */
app.use('/api', require('./api/api.js'));

// Other requests to client
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../../client/index.html'));
});

var server = app.listen(config.port || 3000, function () {
  var host:string = server.address().address;
  var port:number = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// Start socket server
QueueSocket.startServer(server);
