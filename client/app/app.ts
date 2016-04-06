import {Component, Inject} from 'angular2/core';
import {ComponentInstruction, Router, RouteConfig, ROUTER_DIRECTIVES, CanDeactivate} from 'angular2/router';
import {LoginComponent} from "./components/login/login";
import {MainComponent} from "./components/main/main";
import {isLoggedin} from './components/main/is-loggedin';
import {SocketController} from "./components/socket/socket";
import {SubjectsComponent} from './components/subjects/subjects';
import {AuthService} from './services/auth.service';
import {MypageComponent} from './components/mypage/mypage';
import {AdminpageComponent} from "./components/adminpage/adminpage";
import {LoggedInRouterOutlet} from './common/LoggedInOutlet';
import {UserService} from './services/user';
import {SiteHeaderComponent} from './components/siteheader/siteheader';

@Component({
  selector: 'my-app',
  template: `
  <siteheader ></siteheader>
  <br>
  <br>
  <br>
  <auth-router-outlet></auth-router-outlet>`,
  directives: [LoggedInRouterOutlet, SiteHeaderComponent],
  providers:[UserService]
})

@RouteConfig([
  //{path: '/...', component: MainComponent, as: "MainPath"},
  {path: '/login', component: LoginComponent, as: 'LoginPath'},
  {path: '/socket', component: SocketController, as: 'SocketPath', useAsDefault: true},
  {path: '/subjects/:code', component: SubjectsComponent, as: 'SubjectsPath'},
  {path: '/mypage', component: MypageComponent, as: 'MypagePath'},
  {path: '/adminpage', component: AdminpageComponent, as: 'AdminpagePath'}
])


export class App {
  constructor(public router: Router, public auth: AuthService) {}
}
