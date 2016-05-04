import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';
import {UserService} from '../../services/user.service';
import {User} from '../../interfaces/user';
import {AuthService} from '../../services/auth.service';
import {AlertComponent} from '../alert/alert';

@Component({
  selector: 'edit-user',
  templateUrl: 'app/components/edit.user/edit.user.html',
  directives: [AlertComponent]
})
export class EditUserComponent implements OnInit {

  @ViewChild(AlertComponent) alert: AlertComponent;

  message: string;

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
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();

  private editable: any = {};


  private oldpw: string;
  private newpw: string;
  private confpw: string;


  constructor(private userService: UserService, private auth: AuthService, private _params: RouteParams, private router: Router) { }

  ngOnInit() {
   if (!this._user) {
    this.user = null; // Creates empty user in setter
    }
    let id = this._params.get('user_id') || this._params.get('id');
    if (id) {
      this.userService.getUser(id).subscribe((user) => {
        this.user = user;
      });
    }
  }

  setEdits() {
    this.auth.getUser().then((user) => {
      this.editable = {};
      if (user.rights == "Admin") {
        this.editable['name'] = true;
        this.editable['email'] = true;
        this.editable['classOf'] = true;
        this.editable['rights'] = true;
      }
    });
  }

  validate() {
    this.message = "";
    var re: RegExp  = /^\s*$/;

    if (re.test(this.user.firstname)) {
      this.message = "Firstname cannot be empty";
      return false;
    }

    if (re.test(this.user.lastname)) {
      this.message = "Lastname cannot be empty";
      return false;
    }


    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(this.user.email)) {
      this.message = "Email is not correct";
      return false;
    }

    return true;
  }


  onSubmit() {
    if (this.validate()) {
      this.userService.saveUser(this.user).subscribe((user) => {
        this.saved.emit(user);
        this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName]);

      }, (err) => {
        console.log(err.json());
        this.alert.text = err.json().errmsg;
        this.alert.show();
      });
    } else {
      this.alert.text = this.message;
      this.alert.show();
    }
  }

  cancel() {
    this.canceled.emit(null);
    this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName]);
  }
}
