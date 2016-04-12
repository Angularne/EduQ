import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Title} from 'angular2/platform/browser';
import {CanActivate} from 'angular2/router';

//let SERVER_ADDRESS = 'http://109.189.16.142:3000';
//let SERVER_ADDRESS = 'http://158.38.188.119:3000';
//let SERVER_ADDRESS = 'http://localhost:3000';
let SERVER_ADDRESS = 'http://158.38.191.202:3000';


@Component({
  selector: 'socket',
  templateUrl: 'app/components/socket/socket.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [Title]
})

export class SocketController implements OnDestroy, OnInit{
  text: string = ' ';
  clientsConnected: number;
  socket: SocketIOClient.Socket;

  constructor(title: Title) {
    title.setTitle('Socket');

  }

  ngOnInit() {
    this.socket = io.connect(SERVER_ADDRESS + '/TDAT3001-A');

    this.socket.on('queue', (data) => {
      console.log('Socket -- queue');
      console.log(data);
    });

    this.socket.on('broadcast', (data) => {
      console.log('Socket -- broadcast');
      console.log(data);

    });
  }
  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }

  send() {
    //this.socket.emit('send', {text: this.text});
  }
}
