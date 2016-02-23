import {Component} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';

@Component({
  selector: 'queue',
  templateUrl: 'app/components/queue/queue.html'
})

@CanActivate(() => isLoggedin())
export class QueueComponent {

}
