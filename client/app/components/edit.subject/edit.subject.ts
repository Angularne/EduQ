import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from 'angular2/core';
import {RouteParams, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {SubjectService} from '../../services/subject.service';
import {Subject, SubjectUser} from '../../interfaces/subject';
import {EditRequirementComponent} from './requirement/requirement';
import {EditTaskComponent} from './task/task';
import {EditUsersComponent} from './users/users';
import {EditLocationComponent} from './location/location';
import {AlertComponent} from '../alert/alert';


@Component({
  selector: 'edit-subject',
  templateUrl: 'app/components/edit.subject/edit.subject.html',
  directives: [ROUTER_DIRECTIVES, EditRequirementComponent, EditTaskComponent, EditUsersComponent, EditLocationComponent, AlertComponent]
})
export class EditSubjectComponent implements OnInit {
  _subject: Subject;
  @Input() set subject(sub: Subject) {
    this._subject = sub;
    this.splitUsers();
  }
  get subject() {return this._subject;}

  message: string;

  get new() {
    return this.subject._id == null;
  }

  @Output() saved: EventEmitter<Subject> = new EventEmitter<Subject>();
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(AlertComponent) alert: AlertComponent;

  private teachers: SubjectUser[] = [];
  private assistents: SubjectUser[] = [];
  private students: SubjectUser[] = [];

  constructor(private subjectService: SubjectService, private routeParams: RouteParams, private router: Router) { }

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

  validate() {
    this.message = "";
    var re: RegExp  = /^\s*$/;

    if (re.test(this.subject.code)) {
      this.message = "Code cannot be empty: ";
      return false;
    }


    if (re.test(this.subject.name)) {
      this.message = "Name cannot be empty: ";
      return false;
    }


    for (let task of this.subject.tasks) {
      if (re.test(task.title)) {
        this.message = "Some tasks does not have a title"
        return false;
      }
    }

    return true;
  }

  save() {

    // Join users
    this._subject.users = [];
    this._subject.users = this.students.concat(this.teachers, this.assistents);

    if (this.validate()) {
      // Save
      this.subjectService.saveSubject(this.subject).subscribe((subject) => {
        this.saved.emit(subject);
        this.close();
      }, (err) => {
        this.alert.text =  err.json().errmsg;
        this.alert.show();
      });
    } else {
      this.alert.text = this.message;
      this.alert.show();
    }
  }

  cancel() {
    this.canceled.emit(null);
    this.close();
  }

  close() {
    let path = this.router.parent.parent.currentInstruction.component.routeName;
    switch (path) {
      case 'AdminSubjectsPath':
      this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName]);
      break;

      case 'SubjectsPath':
      this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName, 'QueuePath', {code: this.subject.code}]);
      break;
    }
  }

}
