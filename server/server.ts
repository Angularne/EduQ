/// <reference path="./typings/main.d.ts"/>

import express = require('express');
import logger = require('morgan');
import path = require('path');
import bodyParser = require('body-parser');

//import minimist = require('minimist');
//var argv = minimist(process.argv.slice(2));
//console.log(argv);

var app = express();
//.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/../../client"));
app.use(express.static(__dirname+"/../../client/node_modules"));


// api
app.use('/api', require('./api/api.js'));
app.use('/auth', require('./api/auth.js'));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../../client/index.html'));
});

var server = app.listen(3000, function () {
  var host:string = server.address().address;
  var port:number = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

require('./api/socket.js')(server);


console.log(JSON.stringify({
    username: 'test',
    password: 'test'
  }));
