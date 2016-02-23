import {Component} from 'angular2/core';
import {CanActivate, RouteParams} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subjects/subjects.html'
})

@CanActivate(() => isLoggedin())
export class SubjectsComponent {
  id: string;
  constructor(private _params: RouteParams) {
    this.id = _params.get('id');
  }
}
