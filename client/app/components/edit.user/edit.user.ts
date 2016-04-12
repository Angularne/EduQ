import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {UserService} from '../../services/user.service';
import {User} from '../../interfaces/user';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'edit-user',
  templateUrl: 'app/components/edit.user/edit.user.html',
})
export class EditUserComponent implements OnInit {
  private _user: User;

  get user() {
    return this._user;
  }

  @Input() set user(user: User) {
    if (user) {
      this._user = JSON.parse(JSON.stringify(user)); // Copy object
    } else {
      this.user = {
        firstname: '',
        lastname: '',
        email: '',
        rights: 'Student',
        classOf: '',
        subjects: []
      };
    }
    this.setEdits();
  }

  get new() {
    return this._user._id == null;
  }

  @Output() saved: EventEmitter<User> = new EventEmitter<User>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  private editable: any = {};


  private oldpw: string;
  private newpw: string;
  private confpw: string;


  constructor(private userService: UserService, private auth: AuthService, private _params: RouteParams) { }

  ngOnInit() {
   if (!this._user) {
    this.user = null; // Creates empty user in setter
    }
    let id = this._params.get('user_id');
    if (id) {
      this.userService.getUser(id).subscribe((user) => {
        this.user = user;
      });
    }
  }

  setEdits() {
    this.auth.getUser().then((user) => {
      this.editable = {};
      console.log(user.rights);
      if (user.rights == "Admin") {
        this.editable['name'] = true;
        this.editable['email'] = true;
        this.editable['classOf'] = true;
        this.editable['rights'] = true;
        this.editable['password'] = this.new;
      }
      if (user._id == this.user._id) {
        // This is me
        this.editable['password'] = true;
        delete this.editable['rights'];

      }
    });
  }

  valid() {
    return this.user.firstname.trim() != ''
    && this.user.lastname.trim() != ''
    && (!(this.oldpw || this.newpw || this.confpw) || (this.oldpw && this.newpw && this.newpw == this.confpw))
    /** TODO: Match email RegExp */
    // && this.user.email
    ;
  }


  onSubmit() {
    if (this.valid()) {
      console.log(this.user);
      var user: any = this.user;

      if (!this.new) {
        user.oldPassword = this.oldpw;
        user.password = this.newpw;
      }
      this.userService.saveUser(user).subscribe((user) => {
        console.log('User saved');
        this.saved.emit(user);
      });
    }
  }

  close() {
    this.cancel.emit('null');
  }
}
