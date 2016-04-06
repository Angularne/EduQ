import {Component} from 'angular2/core';
import {User} from "../../interfaces/user";

@Component({
  templateUrl: 'app/components/main/main.html',
})

export class MainComponent {
  user: User;
  userString: string;
  constructor()  {

  }
}
