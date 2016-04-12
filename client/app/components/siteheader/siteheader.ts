import {Component, OnInit, OnChanges} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthService} from '../../services/auth.service';
import {Subject} from '../../interfaces/subject';
import {SubjectsComponent} from '../subject/subject';
import {LoggedInRouterOutlet} from '../../common/LoggedInOutlet';
import {User} from '../../interfaces/user';

@Component({
  selector: 'siteheader',
  templateUrl: 'app/components/siteheader/siteheader.html',
  directives: [SubjectsComponent, ROUTER_DIRECTIVES]
})

export class SiteHeaderComponent implements OnInit {
  user: User;
  activeSite: string;

  constructor(public router: Router, public auth: AuthService) {
  }

  ngOnInit() {
    this.auth.authenticated$.subscribe((val) => {
      if (val) {
        this.auth.getUser().then((user) => {
          this.user = user;
        }).catch((err) => {});
      } else {
        this.user = null;
      }
    });

    this.router.subscribe((path: string)=> {
      this.activeSite = path.split('/')[0];
    });


  }



  onLogout() {
    this.auth.logout();
    this.user = null;
    this.router.navigate(['LoginPath'])

  }
}
