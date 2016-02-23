import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {CustomersController} from './components/customers/customers';
import {CustomerController} from './components/customer/customer';
import {CustomerService} from './services/customer';
import {SocketController} from "./components/socket/socket";
import {LoginComponent} from "./components/login/login";
import {MainComponent} from "./components/main/main";
import {QueueComponent} from "./components/queue/queue";
import {SubjectsComponent} from "./components/subjects/subjects";
import {isLoggedin} from './components/main/is-loggedin';
import {Authentication} from './components/login/authentication';

@Component({
  selector: 'my-app',
  template: `
  <div *ngIf="checkLogin()">
  <a [routerLink]="['SocketPath']">Socket</a>
  <a [routerLink]="['MainPath']">Main</a>
  <a [routerLink]="['QueuePath']">Queue</a>
  <a [routerLink]="['SubjectsPath']">Subject</a>
  <a href="#" (click)="onLogout()">Logout</a>
  </div>
  <a *ngIf="!checkLogin()" [routerLink]="['LoginPath']">Login</a>
  <br>
  <router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  providers: [CustomerService]
})

@RouteConfig([
  {path: '/', component: MainComponent, as: "MainPath"},
  {path: '/socket', component: SocketController, as: 'SocketPath'},
  {path: '/login', component: LoginComponent, useAsDefault: true, as: 'LoginPath'},
  {path: '/queue', component: QueueComponent, as: 'QueuePath'},
  {path: '/subjects', component: SubjectsComponent, as: 'SubjectsPath'}
])

export class App {

  constructor(public auth: Authentication, public router: Router) {}

  checkLogin() {
    return isLoggedin();
  }

  onLogout() {
    this.auth.logout()
      .subscribe(
        () => this.router.navigate(['LoginPath'])
      );
  }
}
