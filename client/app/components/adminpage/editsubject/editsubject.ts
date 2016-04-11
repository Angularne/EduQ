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

    this.subjectService.saveSubject(this.subject).subscribe((s)=>{
      console.log('saved');
    });
  }

}
