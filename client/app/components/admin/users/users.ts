import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AddClassComponent} from '../../add.class/add.class';
import {EditUserComponent} from '../../edit.user/edit.user';
import {UserService} from '../../../services/user.service';
import {User} from '../../../interfaces/user';
import {AdminUsersAllComponent} from './all/all';

@Component({
  selector: 'admin-users',
  templateUrl: 'app/components/admin/users/users.html',
  directives: [ ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/', component: AdminUsersAllComponent, as: 'AllPath', useAsDefault: true},
  {path: '/add', component: EditUserComponent, as: 'AddPath'},
  {path: '/addclass', component: AddClassComponent, as: 'AddClassPath'},
  {path: '/:id', component: EditUserComponent, as: 'EditPath'}
])
export class AdminUsersComponent  {
  constructor(private router: Router) { }
}
