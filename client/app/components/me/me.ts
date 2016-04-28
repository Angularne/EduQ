import {Component, OnInit} from "angular2/core";
import {UserService} from "../../services/user.service";
import {User} from "../../interfaces/user";
import {SubjectTaskDetailComponent} from "./subject/subject";
import {EditUserComponent} from '../edit.user/edit.user';
import {AuthService} from '../../services/auth.service';
import {ChangePasswordComponent} from '../change.password/change.password';

@Component({
  selector: 'mypage',
  templateUrl: 'app/components/me/me.html',
  directives: [SubjectTaskDetailComponent, EditUserComponent, ChangePasswordComponent]
})

export class MypageComponent implements OnInit {
  user:User;
  pane: string;

  constructor(public userService:UserService, private auth: AuthService){
  }

  ngOnInit(){
    this.auth.getUser().then((user) =>{
      this.user = user;
    });
  }


  savedUser(user: User) {
    this.pane = 'subjects';
  }

  cancelEditing() {
    this.pane = 'subjects';
  }

}
