import {Component, OnInit} from "angular2/core";
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {AdminUsersComponent} from './users/users';
import {AdminSubjectsComponent} from './subjects/subjects';
import {AdminLocationComponent} from './location/location';

@Component({
  selector: 'adminpage',
  templateUrl: 'app/components/admin/admin.html',
  directives: [AdminUsersComponent, AdminSubjectsComponent, AdminLocationComponent, ROUTER_DIRECTIVES]
})

export class AdminpageComponent {

  panes: {path:string, label:string}[] = [
    {path: 'subjects', label: 'Subjects'},
    {path: 'users', label: 'Users'},
    {path: 'locations', label: 'Locations'}
  ];
  activePane: string;


  constructor(private routeParams: RouteParams){
  }

  ngOnInit(){
    this.activePane = this.routeParams.get('component') || this.panes[0].path;
  }
}
