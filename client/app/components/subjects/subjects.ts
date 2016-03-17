import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {SubjectService} from '../../services/subject';
import {Subject} from '../../interfaces/subject';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subjects/subjects.html',
  providers: [SubjectService]
})

export class SubjectsComponent {
  code: string;
  subject: Subject;
  subjectString: string;

  constructor(private _params: RouteParams, public subjectService: SubjectService) {
    this.code = _params.get('code');

    this.subjectService.getSubject(this.code).then((sub) => {
      this.subject = sub;
      this.subjectString = JSON.stringify(sub);
    });
  }
}
