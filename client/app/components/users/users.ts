import {Component, OnInit} from 'angular2/core';
import {UserService} from '../../services/user.service';
import {User} from '../../interfaces/user';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {EditUserComponent} from '../edit.user/edit.user';
import {UserListComponent} from './userlist/userlist';

@Component({
  selector: 'users',
  templateUrl: 'app/components/users/users.html',
  directives: [EditUserComponent, UserListComponent]
})
export class UsersComponent {

  selected: User;

  constructor() { }


}
