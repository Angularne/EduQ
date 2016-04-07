import {Component} from 'angular2/core';
import {User} from "../../interfaces/user";
import {SocketController} from '../socket/socket';

@Component({
  templateUrl: 'app/components/main/main.html',
  directives: [SocketController]
})

export class MainComponent {
  user: User;
  userString: string;
  constructor()  {

  }
}
