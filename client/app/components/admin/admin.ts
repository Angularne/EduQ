import {Component, OnInit, OnDestroy} from "angular2/core";
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {AdminUsersComponent} from './users/users';
import {AdminSubjectsComponent} from './subjects/subjects';
import {AdminLocationComponent} from './location/location';

@Component({
  selector: 'adminpage',
  templateUrl: 'app/components/admin/admin.html',
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/subjects/...', component: AdminSubjectsComponent, as: 'AdminSubjectsPath', useAsDefault: true},
  {path: '/users/...', component: AdminUsersComponent, as: 'AdminUsersPath'},
  {path: '/locations/...', component: AdminLocationComponent, as: 'AdminLocationsPath'}
])
export class AdminpageComponent {
  constructor(private router: Router){}
}
