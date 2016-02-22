import {Component} from 'angular2/core';
import {Router, CanActivate} from 'angular2/router';
import {Authentication} from '../login/authentication';
import {isLoggedin}  from './is-loggedin';

@Component({
  selector: 'main',
  templateUrl: 'app/components/main/main.html'
})

@CanActivate(() => isLoggedin())
export class MainComponent {
  constructor(public auth: Authentication, public router: Router) {}

  onLogout() {
    this.auth.logout()
      .subscribe(
        () => this.router.navigate(['LoginPath'])
      );
  }
}
