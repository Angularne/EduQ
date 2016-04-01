import {Component, OnInit} from "angular2/core";
import {UserService} from "../../services/user";
import {User} from "../../interfaces/user";
import {SubjectTaskDetailComponent} from "./subject/subject";

@Component({
  selector: 'mypage',
  templateUrl: 'app/components/mypage/mypage.html',
  directives: [SubjectTaskDetailComponent]
})

export class MypageComponent implements OnInit{
  user:User;

  constructor(public userService:UserService){
  }

  ngOnInit(){
    this.userService.getUser().then((user) =>{
      this.user = user;
    });
  }
}
