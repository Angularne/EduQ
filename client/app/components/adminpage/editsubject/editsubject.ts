import {Component, OnInit, EventEmitter, Output} from "angular2/core";
import {SubjectService} from "../../../services/subject";
import {Subject} from "../../../interfaces/subject";

@Component({
  selector: 'editsubject',
  templateUrl: 'app/components/adminpage/editsubject/editsubject.html',
  inputs: ["subject"]
})

export class EditsubjectComponent implements OnInit {
  subject:Subject;
  new:boolean;
  @Output() onEnd: EventEmitter<Subject> = new EventEmitter<Subject>();


  constructor(public subjectService:SubjectService){
  }


  ngOnInit(){
    if(!this.subject){
      this.new = true;
      this.subject = {
        code: '',
        name: '',
        students: [],
        tasks: {
          requirements: [],
          count: 0
        },
        broadcasts: [],
        queue: {
          list: [],
          active: false
        }
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
