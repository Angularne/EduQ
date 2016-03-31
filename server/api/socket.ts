import socketio = require('socket.io');





export namespace QueueSocket {
  var io: SocketIO.Server;
  export function startServer(server){
    io = socketio(server);
  }
  export function openQueue(subject: string) {
    if (!io) return;
    var nsp = io.of(subject);
    nsp.on('connection', (socket) => {
      console.log('Socket Connected: ' + socket.id);

      socket.on('disconnect', () => {
        console.log('Socket disconnected: ' + socket.id);
      })
    });
  }
  export function closeQueue(subject: string) {
    delete io.nsps[subject];
  }
  export function updateQueue(subject: string, queue) {
    if (!io) openQueue(subject);
    io.of(subject).emit('queue-update', queue);
  }


  export function broadcast(subject: string, broadcast) {
    if (!io) openQueue(subject);
    console.log('emit:' + subject + ':' + 'broadcast');
    console.log(broadcast);
    io.of(subject).emit('new-broadcast', broadcast);

  }


  export function chat() {
    if (!io) return;
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


}
