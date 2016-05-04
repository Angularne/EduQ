import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router} from '@angular/router-deprecated';
import {SubjectComponent} from '../subject/subject';
import {EditSubjectComponent} from '../edit.subject/edit.subject';
import {SubjectUsersComponent} from '../subject.users/subject.users';
import {StudentsTasksComponent} from '../students.tasks/students.tasks';
import {SubjectService} from '../../services/subject.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subjects/subjects.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [SubjectService]
})
@RouteConfig([
  {path: '/:code/', component: SubjectComponent, as: 'QueuePath', useAsDefault: true},
  {path: '/:code/edit', component: EditSubjectComponent, as: 'EditPath'},
  {path: '/:code/users', component: SubjectUsersComponent, as: 'UsersPath'},
  {path: '/:code/tasks', component: StudentsTasksComponent, as: 'TasksPath'},
  {path: '**', redirectTo: ['MainPath']}
])
export class SubjectsComponent {

  teacher: boolean;
  assistent: boolean;

  role: string;
  code: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.code = this.router.currentInstruction.urlPath.split('/')[0];
    this.auth.getUser().then(user => {
      for (let subject of user.subjects) {
        if (subject.code == this.code) {
          if (subject.role == 'Teacher') {
            this.teacher = true;
            this.assistent = true;
          }
          if (subject.role == 'Assistent') {
            this.assistent = true;
          }
          break;
        }
      }
    }).catch(() => {});
  }
}
