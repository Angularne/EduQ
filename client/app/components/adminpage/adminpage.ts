import {Component, OnInit} from "angular2/core";
import {UserService} from "../../services/user.service";
import {SubjectService} from "../../services/subject.service";
import {User} from "../../interfaces/user";
import {Subject} from "../../interfaces/subject";
import {EditSubjectComponent} from '../edit.subject/edit.subject';

@Component({
  selector: 'adminpage',
  templateUrl: 'app/components/adminpage/adminpage.html',
  providers: [SubjectService],
  directives: [EditSubjectComponent]
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
    this.subjectService.getSubject(this.subjects[i].code).subscribe((sub) => {
      this.subjects[i] = sub;
      this.selectedSubject = sub;
    });
  }

  closeEditPane(subject: Subject) {
    this.subjects.push(subject);

  }
}
