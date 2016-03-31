import {Component, Injector} from 'angular2/core';
import {Router, CanActivate, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {isLoggedin}  from './is-loggedin';

import {SocketController} from '../socket/socket';
import {SubjectsComponent} from '../subjects/subjects';
import {SubjectService} from '../../services/subject';
import {SiteHeaderComponent} from '../siteheader/siteheader';
import {UserService} from '../../services/user';
import {User} from "../../interfaces/user";
import {Subject} from "../../interfaces/subject";
import {AuthService} from '../../services/auth.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import {MypageComponent} from "../mypage/mypage";

@Component({
  templateUrl: 'app/components/main/main.html',
  directives: [ROUTER_DIRECTIVES, SiteHeaderComponent],
  providers: [UserService]
})

@RouteConfig([
  {path: '/socket', component: SocketController, as: 'SocketPath', useAsDefault: true},
  {path: '/subjects/:code', component: SubjectsComponent, as: 'SubjectsPath'},
  {path: '/mypage', component: MypageComponent, as: 'MypagePath'}
])

@CanActivate(() => {
/*
  var injector = Injector.resolveAndCreate([AuthService, HTTP_PROVIDERS]);
  var authService = injector.get(AuthService);

  return authService.isAuthenticated();
  */

  return !!sessionStorage.getItem('authToken');
})
export class MainComponent {
  user: User;
  userString: string;
  constructor(public router: Router, public userservice: UserService)  {
    this.userservice = userservice;
    this.userservice.getUser().then((user) => {
      this.user = user;
      this.userString = JSON.stringify(this.user);
    });

  }
}
