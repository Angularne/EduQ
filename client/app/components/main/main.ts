import {Component} from 'angular2/core';
import {Router, CanActivate, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {isLoggedin}  from './is-loggedin';

import {SocketController} from '../socket/socket';
import {SubjectsComponent} from '../subjects/subjects';
import {Subject, SubjectService} from '../../services/subject';
import {Authentication} from '../login/authentication';
import {SiteHeaderComponent} from '../siteheader/siteheader';

@Component({
  templateUrl: 'app/components/main/main.html',
  directives: [ROUTER_DIRECTIVES, SiteHeaderComponent]
})

@RouteConfig([
  {path: '/socket', component: SocketController, as: 'SocketPath', useAsDefault: true},
  {path: '/subjects', component: SubjectsComponent, as: 'SubjectsPath'}
])

@CanActivate(() => isLoggedin())
export class MainComponent {
  subjects: Subject[] = [];
  constructor(public router: Router)  {

  }
}
