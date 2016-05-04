import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {User} from '../../../interfaces/user';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
  selector: 'user-list',
  templateUrl: 'app/components/users/userlist/userlist.html',
  directives: [ROUTER_DIRECTIVES]
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  @Output() selected: EventEmitter<User> = new EventEmitter<User>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('UserList');
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
