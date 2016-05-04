import {Component} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {EditSubjectComponent} from '../../edit.subject/edit.subject';
import {SubjectUsersComponent} from '../../subject.users/subject.users';
import {AdminSubjectsAllComponent} from './all/all';


@Component({
  selector: 'admin-subjects',
  templateUrl: 'app/components/admin/subjects/subjects.html',
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/', component: AdminSubjectsAllComponent, as: 'AllPath', useAsDefault: true},
  {path: '/add', component: EditSubjectComponent, as: 'AddPath'},
  {path: '/:code', component: EditSubjectComponent, as: 'EditPath'},
  {path: '/:code/students', component: SubjectUsersComponent, as: 'StudentsPath'}

])
export class AdminSubjectsComponent {
  constructor(private router: Router) { }
}
