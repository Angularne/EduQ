import {Component} from "@angular/core";
import {User} from "../../interfaces/user";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {MainBroadcastComponent} from "./main-broadcasts/main-broadcasts";

@Component({
  templateUrl: "app/components/main/main.html",
  directives: [ROUTER_DIRECTIVES, MainBroadcastComponent]

})

export class MainComponent {
  user: User;
  userString: string;
  constructor()  {

  }
}
