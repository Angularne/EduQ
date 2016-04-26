import {Component, Inject, ChangeDetectionStrategy} from 'angular2/core';
import {RouteConfig} from 'angular2/router';
import {LoginComponent} from "./components/login/login";
import {MainComponent} from "./components/main/main";
import {SubjectsComponent} from './components/subject/subject';
import {AuthService} from './services/auth.service';
import {MypageComponent} from './components/me/me';
import {AdminpageComponent} from "./components/adminpage/adminpage";
import {LoggedInRouterOutlet} from './common/LoggedInOutlet';
import {UserService} from './services/user.service';
import {SiteHeaderComponent} from './components/siteheader/siteheader';
import {EditSubjectComponent} from './components/edit.subject/edit.subject';
import {EditUserComponent} from './components/edit.user/edit.user';
import {SubjectService} from './services/subject.service';
import {UsersComponent} from './components/users/users';
import {SubjectUsersComponent} from './components/subject.users/subject.users';
import {StudentsTasksComponent} from './components/students.tasks/students.tasks';
import {AddClassComponent} from './components/add.class/add.class';

@Component({
  selector: 'my-app',
  template: `
  <header id="page-header">
    <siteheader></siteheader>
  </header>
  <div id="page-wrapper">
    <div class="container">
      <auth-router-outlet></auth-router-outlet>
    </div>
  </div>
  `,
  directives: [LoggedInRouterOutlet, SiteHeaderComponent],
  providers:[UserService, SubjectService]
})

@RouteConfig([
  {path: '/', component: MainComponent, as: 'MainPath', useAsDefault: true},
  {path: '/login', component: LoginComponent, as: 'LoginPath'},

  {path: '/me', component: MypageComponent, as: 'MypagePath'},
  {path: '/adminpage', component: AdminpageComponent, as: 'AdminpagePath'},

  /** Subject */
  // {path: '/subjects', component: SubjectsListComponent, as: 'SubjectsListPath'}, // List all subjects
  {path: '/subjects/:code', component: SubjectsComponent, as: 'SubjectsPath'},
  {path: '/subjects/:code/edit', component: EditSubjectComponent, as: 'EditSubjectPath'},
  {path: '/subjects/:code/users', component: SubjectUsersComponent, as: 'SubjectUsersPath'},
  {path: 'subjects/:code/tasks', component: StudentsTasksComponent, as: 'StudentsTasksPath'},

  {path: '/subject/new', component: EditSubjectComponent, as: 'NewSubjectPath'},


  /** Users */
  {path: '/users', component: UsersComponent, as: 'UserListPath'}, // List all users
  {path: '/users/:user_id', component: EditUserComponent, as: 'EditUserPath'},

  {path: 'users/class/add', component: AddClassComponent, as: 'AddClassPath'},


  /** Redirect to main */
  {path: '/**', redirectTo:['MainPath']}

])


export class App {
  constructor(public auth: AuthService) {}
}
