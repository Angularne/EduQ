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
import {Subject, SubjectService} from './services/subject';

@Component({
  selector: 'my-app',
  template: `
  <div *ngIf="checkLogin()">
  <a [routerLink]="['SocketPath']">Socket</a>
  <a [routerLink]="['MainPath']">Main</a>
  <a [routerLink]="['QueuePath']">Queue</a>
  <div class="dropdown">
  <button (click)="toggleDrop()">
Subjects
<span class="caret"></span>
  </button>
  <ul *ngIf="checkToggle()">
  <li *ngFor="#subject of subjects"> <a [routerLink]="['SubjectsPath', {id:subject.id}]">{{subject.name}}</a> </li>
  </ul>
  </div>
  <a href="#" (click)="onLogout()">Logout</a>
  </div>
  <a *ngIf="!checkLogin()" [routerLink]="['LoginPath']">Login</a>
  <br>
  <router-outlet [id]="id"></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  providers: [CustomerService, SubjectService]
})

@RouteConfig([
  {path: '/', component: MainComponent, as: "MainPath"},
  {path: '/socket', component: SocketController, as: 'SocketPath'},
  {path: '/login', component: LoginComponent, useAsDefault: true, as: 'LoginPath'},
  {path: '/queue', component: QueueComponent, as: 'QueuePath'},
  {path: '/subjects', component: SubjectsComponent, as: 'SubjectsPath'}
])

export class App {
  subjects: Subject[] = [];
  toggleDropdown: boolean = false;
  constructor(public auth: Authentication, public router: Router, public subjectservice: SubjectService) {
    this.subjects = this.subjectservice.getSubjects();
  }
  toggleDrop() {
    this.toggleDropdown = !this.toggleDropdown;
  }
  checkToggle() {
    return this.toggleDropdown;
  }

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
