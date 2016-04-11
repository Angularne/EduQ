import {Component, Input, OnInit} from 'angular2/core';
import {Subject} from '../../../interfaces/subject';
import {User} from '../../../interfaces/user';
import {UserService} from '../../../services/user';

@Component({
  selector: 'edit-users',
  templateUrl: 'app/components/edit.subject/users/users.html'
})
export class EditUsersComponent implements OnInit {

  _users: User[] = [];
  @Input() set users(users: User[]){
    this._users = users;
    this.fetchAllUsers();
    this.query = '';
    this.suggestions = [];
  }
  get users() {return this._users;}


  all: User[] = [];
  @Input() label: string;

  @Input() type: string;  // Teacher | Student | Admin

  query: string = '';
  suggestions: User[] = [];



  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  fetchAllUsers() {
    this.userService.getAllUsers(this.type ? {rights:this.type} : {}, 'firstname,lastname').subscribe((users) => {
      this.all = [];
      for (var user of users) {
        if (!this.inUsers(user)) {
          this.all.push(user);
        }
      }
      console.log('get all');
      console.log(this.all);
    });
  }

  private inUsers(user: User) {
    for (var u of this.users) {
      if (u._id == user._id) {
        return true;
      }
    }
    return false;
  }

  suggest() {
    let q = new RegExp(this.query, 'i');
    this.suggestions = [];
    if (this.query.length) {
      for (var user of this.all) {
        var name = `${user.firstname} ${user.lastname}`;
        if (q.test(name)) {
          this.suggestions.push(user);
        }
      }
    }
  }

  add() {
    if (this.suggestions.length) {
      this.addUser(this.suggestions[0]);
    }
  }

  addUser(user) {
    this.users.push(user);
    this.query = '';
    this.suggestions = [];

    let i = this.all.indexOf(user);
    if (i >= 0 && i < this.all.length) {
      this.all.splice(i, 1);
    }
  }

  removeUser(i){
    this.all.unshift(this.users[i]);
    this.users.splice(i, 1);
  }

}
