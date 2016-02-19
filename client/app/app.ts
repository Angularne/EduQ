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


@Component({
  selector: 'my-app',
  template: `
  <a [routerLink]="['CustomersPath']">Customers</a>
  <a [routerLink]="['SocketPath']">Socket</a>
  <a [routerLink]="['LoginPath']">Login</a>
  <a [routerLink]="['MainPath']">Main</a>
  <a [routerLink]="['QueuePath']">Queue</a>
  <a [routerLink]="['SubjectsPath']">Subject</a>

  <br>
  <router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  providers: [CustomerService]
})

@RouteConfig([
  {path: '/', component: CustomersController, useAsDefault: true, as: "CustomersPath"},
  {path: '/customer/:id', component: CustomerController, as: "CustomerPath"},
  {path: '/socket', component: SocketController, as: 'SocketPath'},
  {path: 'login', component: LoginComponent, as: 'LoginPath'},
  {path: 'main', component: MainComponent, as: 'MainPath'},
  {path: 'queue', component: QueueComponent, as: 'QueuePath'},
  {path: 'subjects', component: SubjectsComponent, as: 'SubjectsPath'}
])

export class App { }
