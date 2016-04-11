import {Component, Inject} from 'angular2/core';
import {RouteConfig} from 'angular2/router';
import {LoginComponent} from "./components/login/login";
import {MainComponent} from "./components/main/main";
import {SubjectsComponent} from './components/subjects/subjects';
import {AuthService} from './services/auth.service';
import {MypageComponent} from './components/mypage/mypage';
import {AdminpageComponent} from "./components/adminpage/adminpage";
import {LoggedInRouterOutlet} from './common/LoggedInOutlet';
import {UserService} from './services/user';
import {SiteHeaderComponent} from './components/siteheader/siteheader';

import {EditSubjectComponent} from './components/edit.subject/edit.subject';
import {EditUserComponent} from './components/edit.user/edit.user';

import {SubjectService} from './services/subject';

@Component({
  selector: 'my-app',
  template: `
  <siteheader ></siteheader>
  <br><br><br><br>
  <div class="container">
  <auth-router-outlet></auth-router-outlet>
  </div>
  `,
  directives: [LoggedInRouterOutlet, SiteHeaderComponent],
  providers:[UserService, SubjectService]
})

@RouteConfig([
  {path: '/', component: MainComponent, as: 'MainPath', useAsDefault: true},
  {path: '/login', component: LoginComponent, as: 'LoginPath'},
  {path: '/subjects/:code', component: SubjectsComponent, as: 'SubjectsPath'},
  {path: '/subjects/:code/edit', component: SubjectsComponent, as: 'SubjectEditPath'},
  {path: '/me', component: MypageComponent, as: 'MypagePath'},
  {path: '/adminpage', component: AdminpageComponent, as: 'AdminpagePath'},




  {path: '/subject/new', component: EditSubjectComponent, as: 'NewSubjectPath'},
  {path: '/user/:user_id', component: EditUserComponent, as: 'EditUserPath'},



  {path: '/**', redirectTo:['MainPath']}

])


export class App {
  constructor(public auth: AuthService) {}
}
