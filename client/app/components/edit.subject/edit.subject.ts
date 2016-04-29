import {Component, OnInit, Input, EventEmitter, Output} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {SubjectService} from '../../services/subject.service';
import {Subject, SubjectUser} from '../../interfaces/subject';
import {EditRequirementComponent} from './requirement/requirement';
import {EditTaskComponent} from './task/task';
import {EditUsersComponent} from './users/users';
import {EditLocationComponent} from './location/location';


@Component({
  selector: 'edit-subject',
  templateUrl: 'app/components/edit.subject/edit.subject.html',
  directives: [ROUTER_DIRECTIVES, EditRequirementComponent, EditTaskComponent, EditUsersComponent, EditLocationComponent]
})
export class EditSubjectComponent implements OnInit {
  _subject: Subject;
  @Input() set subject(sub: Subject) {
    this._subject = sub;
    this.splitUsers();
  }
  get subject() {return this._subject;}


  get new() {
    return this.subject._id == null;
  }

  @Output() saved: EventEmitter<Subject> = new EventEmitter<Subject>();
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();


  private teachers: SubjectUser[] = [];
  private assistents: SubjectUser[] = [];
  private students: SubjectUser[] = [];

  constructor(private subjectService: SubjectService, private routeParams: RouteParams) { }

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
        users: [],
        locations: []
      }

      // Get subject if no input
      let code = this.routeParams.get('code') || this.routeParams.get('id');
      if (code) {
        this.subjectService.getSubject(code).subscribe((sub) => {
          this.subject = sub;
        });
      }
    }
  }

  splitUsers(){
    this.students = [];
    this.assistents = [];
    this.teachers = [];
    for (var user of this._subject.users) {
      switch (user.role) {
        case 'Student':
          this.students.push(user);
          break

        case 'Assistent':
          this.assistents.push(user);
          break;

        case 'Teacher':
          this.teachers.push(user);
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

    // Join users
    this._subject.users = [];
    this._subject.users = this.students.concat(this.teachers, this.assistents);


    // Save
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
    if (req.end - req.start + 1 < req.required) {
      req.required = req.end - req.start + 1;
    }
  }

}
