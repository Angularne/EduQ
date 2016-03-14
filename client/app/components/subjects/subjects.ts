import {Component} from 'angular2/core';
import {CanActivate, RouteParams} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subjects/subjects.html'
})

export class SubjectsComponent {
  code: string;
  constructor(private _params: RouteParams) {
    this.code = _params.get('code');
  }
}
