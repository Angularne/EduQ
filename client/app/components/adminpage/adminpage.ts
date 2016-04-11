import {Component, OnInit} from "angular2/core";
import {UserService} from "../../services/user";
import {SubjectService} from "../../services/subject";
import {User} from "../../interfaces/user";
import {Subject} from "../../interfaces/subject";
import {EditSubjectComponent} from '../edit.subject/edit.subject';
import {BSColDirective} from '../../directives/bs.col.directive';

@Component({
  selector: 'adminpage',
  templateUrl: 'app/components/adminpage/adminpage.html',
  providers: [SubjectService],
  directives: [EditSubjectComponent, BSColDirective]
})

export class AdminpageComponent{
users:User[];
subjects:Subject[] = [];
selectedSubject: Subject;


  constructor(public userService:UserService, public subjectService:SubjectService){
  }

  ngOnInit(){
    this.userService.getAllUsers(null, 'firstname,lastname').subscribe((users) =>{
      this.users = users;
    });

    this.subjectService.getAllSubjects({},'','teachers,assistents,students.user;firstname,lastname').subscribe((subjects) =>{
      console.log(subjects);
      this.subjects = subjects;
    });
  }

  setSelectedSubject(i:number){
    this.selectedSubject = this.subjects[i];
  }

  closeEditPane(subject: Subject) {
    this.subjects.push(subject);

  }
}
