import {Component, OnInit, EventEmitter, Input, Output} from "angular2/core";
import {SubjectService} from "../../../services/subject";
import {Subject} from "../../../interfaces/subject";

@Component({
  selector: 'editsubject',
  templateUrl: 'app/components/adminpage/editsubject/editsubject.html',
})

export class EditsubjectComponent implements OnInit {
  @Input() subject:Subject;
  @Input() new:boolean;

  @Output() onEnd: EventEmitter<Subject> = new EventEmitter<Subject>();


  constructor(public subjectService:SubjectService){
  }


  ngOnInit(){
    if(!this.subject){
      this.new = true;
      this.subject = {
        code: '',
        name: '',
        tasks: [],
        requirements: [],
        broadcasts: [],
        queue: {
          list: [],
          active: false
        },
        students: [],
        assistents: [],
        teachers: []
      }
    }
  }

  saveSubject(){
    if(this.new){
      this.subjectService.addNewSubject(this.subject).then((subject: Subject)=>{
        if(subject){
          //Event for bekreftet lagring av nytt fag
          this.onEnd.emit(subject);
        }else{
          //Event for feil under lagring av nytt fag
        }
      });
    } else {
      this.subjectService.updateSubject(this.subject).then((subject: Subject) => {
        console.log("updated");
      });
    }
  }

}
