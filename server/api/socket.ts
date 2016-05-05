import socketio = require("socket.io");

import {Subject} from "./models/subject";



export namespace QueueSocket {
  let io: SocketIO.Server;
  export function startServer(server) {
    io = socketio(server);

    // Create namespaces
    Subject.find({}).exec().then((subjects) => {
      for (let sub of subjects) {
        createNamespace(sub.code);
      }
    });
  }

  export function createNamespace(code: string) {
    io.of(code).on("connection", (socket) => {
      console.log("Socket Connected: " + socket.id);
      socket.on("disconnect", () => {
        console.log("Socket disconnected: " + socket.id);
      });
    });
  }

  export function removeNamespace(code: string) {
    delete io.nsps[code];
  }

  export function queue(code: string) {
    if (io && code) {
      Subject.findOne({code: code}).select("queue").populate("queue.list.users queue.list.helper", "firstname lastname").lean().exec().then((subj) => {
        io.of(code).emit("queue", subj.queue);
      });

    }
  }

  export function broadcast(code: string) {
    if (io && code) {
      Subject.findOne({code: code}).select("broadcasts").populate("broadcasts.author", "firstname lastname").lean().exec().then((subj) => {
        io.of(code).emit("broadcast", subj.broadcasts);
      });
    }
  }
}
