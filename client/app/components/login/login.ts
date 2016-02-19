import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';



@Component({
  selector: 'login',
  templateUrl: 'app/components/login/login.html',
  directives: [ROUTER_DIRECTIVES]
})

export class LoginComponent implements OnInit {


  constructor() {

  }

  ngOnInit() {
    console.log('login init')
   }
}
