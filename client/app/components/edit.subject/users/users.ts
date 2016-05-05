import {Component, Input, OnInit} from "@angular/core";
import {User} from "../../../interfaces/user";
import {UserService} from "../../../services/user.service";

@Component({
  selector: "edit-users",
  templateUrl: "app/components/edit.subject/users/users.html"
})
export class EditUsersComponent implements OnInit {

  private _users: User[] = [];
  @Input() set users(users: User[]){
    this._users = users;
    if (this._users && this._type) {
      this.fetchAllUsers();
    }
    this.query = "";
    this.suggestions = [];
  }
  get users() {
    return this._users;
  }

  private all: User[];


  @Input() label: string;
  @Input() role: string;  // Teacher | Assistent

  private _type: string;
  @Input() set type(type: string) {  // Teacher | Student | Admin
    this._type = type;

    if (this._type && this._users) {
      this.fetchAllUsers();

    }
  }
  get type() {
    return this._type;
  }

  query: string = "";
  suggestions: User[] = [];



  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  fetchAllUsers() {
    this.userService.getAllUsers(this.type ? {rights: this.type} : null, "firstname,lastname").subscribe((users) => {
      this.all = [];
      for (let user of users) {
        if (!this.inUsers(user)) {
          this.all.push(user);
        }
      }
    });
  }

  private inUsers(user: User) {
    for (let u of this.users) {
      if (u._id === user._id) {
        return true;
      }
    }
    return false;
  }

  suggest() {
    let q = new RegExp(this.query, "i");
    this.suggestions = [];
    if (this.query.length) {
      for (let user of this.all) {
        let name = `${user.firstname} ${user.lastname}`;
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
    user.role = this.role;

    this.users.push(user);
    this.query = "";
    this.suggestions = [];

    let i = 0;
    for (let u of this.all) {
      if (user._id === u._id) {
        this.all.splice(i, 1);
        break;
      }
      i++;
    }

  }

  removeUser(user) {
    this.all.unshift(user);
    user.role = null;
    for (let i in this.users) {
      if (this.users[i]._id === user._id) {
        this.users.splice(+i, 1);
        break;
      }
    }
  }

}
