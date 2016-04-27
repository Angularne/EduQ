import {Component, OnInit} from "angular2/core";
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {AdminUsersComponent} from './users/users';
import {AdminSubjectsComponent} from './subjects/subjects';
import {AdminRoomsComponent} from './rooms/rooms';

@Component({
  selector: 'adminpage',
  templateUrl: 'app/components/admin/admin.html',
  directives: [AdminUsersComponent, AdminSubjectsComponent, AdminRoomsComponent, ROUTER_DIRECTIVES]
})

export class AdminpageComponent {

  panes: {path:string, label:string}[] = [
    {path: 'subjects', label: 'Subjects'},
    {path: 'users', label: 'Users'},
    {path: 'rooms', label: 'Rooms'}
  ];
  activePane: string;


  constructor(private routeParams: RouteParams){
  }

  ngOnInit(){
    this.activePane = this.routeParams.get('component') || this.panes[0].path;
  }
}
