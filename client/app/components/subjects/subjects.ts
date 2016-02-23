import {Component} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subjects/subjects.html'
})

@CanActivate(() => isLoggedin())
export class SubjectsComponent {

}
