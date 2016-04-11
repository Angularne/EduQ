import {Component, OnInit, Input, EventEmitter, Output} from 'angular2/core';
import {SubjectService} from '../../services/subject';
import {Subject} from '../../interfaces/subject';
import {EditRequirementComponent} from './requirement/requirement';
import {EditTaskComponent} from './task/task';
import {EditUsersComponent} from './users/users';


@Component({
  selector: 'edit-subject',
  templateUrl: 'app/components/edit.subject/edit.subject.html',
  directives: [EditRequirementComponent, EditTaskComponent, EditUsersComponent]
})
export class EditSubjectComponent implements OnInit {
  @Input() subject: Subject;

  get new() {
    return this.subject._id == null;
  }

  @Output() saved: EventEmitter<Subject> = new EventEmitter<Subject>();
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();


  constructor(private subjectService: SubjectService) { }

  ngOnInit() {
    if(!this.subject){
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

  addRequirement() {
    this.subject.requirements.push({from:1, to: this.subject.tasks.length, required:1});
  }

  removeRequirement(index: number) {
    this.subject.requirements.splice(index, 1);
  }

  save() {
    this.subjectService.saveSubject(this.subject).subscribe((subject) => {
      this.saved.emit(subject);
    }, (err) => {
      console.error(err);
    });
  }

  cancel() {
    this.canceled.emit(null);
  }

  validateRequirement(req: any) {
    console.log(req);
    if (req.end - req.start + 1 < req.required) {
      req.required = req.end - req.start + 1;
    }
  }

}
