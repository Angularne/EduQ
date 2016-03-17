import {Injector, Component} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'queue',
  templateUrl: 'app/components/queue/queue.html'
})

@CanActivate((next, prev) => {
  var injector = Injector.resolveAndCreate([
    AuthService
  ])

  var authService = injector.get(AuthService);

  return authService.isAuthenticated();
})
export class QueueComponent {

}
