import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {CustomersController} from './controllers/customers';
import {CustomerController} from './controllers/customer';
import {CustomerService} from './data_access/customer';
import {SocketController} from "./controllers/socket";

@Component({
  selector: 'my-app',
  template: `
  <a [routerLink]="['CustomersPath']">Customers</a>
  <a [routerLink]="['SocketPath']">Socket</a>
  <br>
  <router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  providers: [CustomerService]
})

@RouteConfig([
  {path: '/', component: CustomersController, useAsDefault: true, as: "CustomersPath"},
  {path: '/customer/:id', component: CustomerController, as: "CustomerPath"},
  {path: '/socket', component: SocketController, as: 'SocketPath'}
])

export class App { }
