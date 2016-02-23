import {Component} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {isLoggedin}  from './is-loggedin';

@Component({
  selector: 'main',
  templateUrl: 'app/components/main/main.html'
})

@CanActivate(() => isLoggedin())
export class MainComponent {

}
