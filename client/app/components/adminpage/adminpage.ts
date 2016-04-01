import {Component, OnInit} from "angular2/core";
import {UserService} from "../../services/user";
import {SubjectService} from "../../services/subject";
import {User} from "../../interfaces/user";
import {Subject} from "../../interfaces/subject";
import {EditsubjectComponent} from "./editsubject/editsubject";

@Component({
  selector: 'adminpage',
  templateUrl: 'app/components/adminpage/adminpage.html',
  providers: [SubjectService],
  directives: [EditsubjectComponent]
})

export class AdminpageComponent{
users:User[];
subjects:Subject[];


  constructor(public userService:UserService, public subjectService:SubjectService){
  }

  ngOnInit(){
    this.userService.getAllUsers().then((users) =>{
      this.users = users;
    });

    this.subjectService.getAllSubjects().then((subjects) =>{
      this.subjects = subjects;
    })
  }

  closeEditPane(subject: Subject) {
    this.subjects.push(subject);

  }
}
