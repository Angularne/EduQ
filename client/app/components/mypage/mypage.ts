import {Component} from "angular2/core";
import {UserService} from "../../services/user";
import {User} from "../../interfaces/user";
import {SubjectTaskDetailComponent} from "./subject/subject";

@Component({
  selector: 'mypage',
  templateUrl: 'app/components/mypage/mypage.html',
  directives: [SubjectTaskDetailComponent]
})

export class MypageComponent{
  user:User;

  constructor(public userService:UserService){
    this.userService.getUser().then((user) =>{
      this.user = user;


    });
  }
}
