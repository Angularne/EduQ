import socketio = require('socket.io');


export function start(server) {
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
}
