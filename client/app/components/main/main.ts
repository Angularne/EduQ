import {Component} from 'angular2/core';
import {User} from "../../interfaces/user";
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  templateUrl: 'app/components/main/main.html',
  directives: [ROUTER_DIRECTIVES]

})

export class MainComponent {
  user: User;
  userString: string;
  constructor()  {

  }
}
