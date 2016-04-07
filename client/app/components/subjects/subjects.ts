import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {SubjectService} from '../../services/subject';
import {Subject} from '../../interfaces/subject';
import {QueueComponent} from '../queue/queue';
import {BroadcastComponent} from '../broadcasts/broadcasts';
import {EditSubjectComponent} from '../edit.subject/edit.subject';
import {EditSubjectUsersComponent} from '../edit.subject.users/edit.subject.users';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subjects/subjects.html',
  providers: [SubjectService],
  directives: [QueueComponent, BroadcastComponent, EditSubjectComponent, EditSubjectUsersComponent]
})

export class SubjectsComponent {
  code: string;
  subject: Subject;
  subjectString: string;
  userRole: string;

  constructor(private _params: RouteParams, public subjectService: SubjectService) {
    this.code = _params.get('code');

    this.subjectService.getSubject(this.code).then((sub) => {
      this.subject = sub;
      this.subjectString = JSON.stringify(sub);
    });
    this.subjectService.getUserSubjectRole(this.code).then((sub) => {
      this.userRole = sub;
    })
  }
}
