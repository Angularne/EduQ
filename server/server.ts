/// <reference path="./typings/main.d.ts"/>

import express = require('express');
import socketio = require('socket.io');
import path = require('path');


var app = express();

app.use(express.static(__dirname+"/../../client"));
app.use(express.static(__dirname+"/../../client/node_modules"));

app.get('/test', function (req, res) {
  res.send("hello");
});

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../../client/index.html'));
});



var server = app.listen(3000, function () {
  var host:string = server.address().address;
  var port:number = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var io = socketio(server);
var text: string = 'sup?';
var clientsConnected: number = 0;
io.on('connection', (socket) => {
  clientsConnected++;
  console.log('socket:connection - ' + clientsConnected);
  io.emit('change',
  {
    text: text,
    clients: clientsConnected
  });

  socket.on('send', (data) => {
    text = data.text;
    console.log(data);
    socket.broadcast.emit('change',   {
        text: text,
        clients: clientsConnected
      });
  });

  socket.on('close', (socket)=>{
    clientsConnected--;
    console.log('socket:close - ' + clientsConnected);
    io.emit('change',
    {
      text: text,
      clients: clientsConnected
    });
  });
  socket.on('disconnect', (socket)=>{
    clientsConnected--;
    console.log('socket:disconnect - ' + clientsConnected);
    io.emit('change',
    {
      text: text,
      clients: clientsConnected
    });
  });
});
