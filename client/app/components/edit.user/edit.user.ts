import {Component, OnInit, Input} from 'angular2/core';
import {UserService} from '../../services/user';
import {User} from '../../interfaces/user';
import {AuthService} from '../../services/auth.service';
import {BSColDirective} from '../../directives/bs.col.directive';

@Component({
  selector: 'edit-user',
  templateUrl: 'app/components/edit.user/edit.user.html',
  directives: [BSColDirective]
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
      this._user = user;
    }
    this.setEdits();
  }

  @Input() new: boolean = false;


  private canEdit: any = {};


  private oldpw: string;
  private newpw: string;
  private confpw: string;


  constructor(private userService: UserService, private auth: AuthService) { }

  ngOnInit() {
    if (!this.user) {
      this.user = {
        firstname: '',
        lastname: '',
        email: '',
        rights: 'Student',
        classOf: '',
        subjects: []
      };
    }


  }

  setEdits() {
    this.auth.getUser().then((user) => {
      this.canEdit = {};
      if (user.rights == "Admin") {
        this.canEdit['name'] = true;
        this.canEdit['email'] = true;
        this.canEdit['classOf'] = true;
      }
      if (user._id == this.user._id) {
        // This is me
        this.canEdit['password'] = true;
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
      });
    }
  }
}
