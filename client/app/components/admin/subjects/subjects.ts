import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {SubjectService} from '../../../services/subject.service';
import {Subject} from '../../../interfaces/subject';
import {EditSubjectComponent} from '../../edit.subject/edit.subject';
import {SubjectUsersComponent} from '../../subject.users/subject.users';

@Component({
  selector: 'admin-subjects',
  templateUrl: 'app/components/admin/subjects/subjects.html',
  directives: [EditSubjectComponent, SubjectUsersComponent, ROUTER_DIRECTIVES]
})
export class AdminSubjectsComponent implements OnInit {
  subjects: Subject[];
  filteredSubjects: Subject[];
  activePane: string = 'all';

  constructor(private subjectService: SubjectService, private routeParams: RouteParams, private router: Router) { }

  ngOnInit(){

    let pane = this.routeParams.get('action') || 'all';

    if (pane == 'edit' || pane == 'students') {
      let code = this.routeParams.get('id');
      if (code) {
        this.activePane = pane
      }
    } else {
      this.activePane = pane;
    }

    this.subjectService.getAllSubjects().subscribe(res => {
      this.subjects = res;
      this.filteredSubjects = res;
    });

  }

  filter(query: string) {
    let regexp = new RegExp(query, 'i');

    this.filteredSubjects = this.subjects.filter(u => {
      return regexp.test(u.code + ' ' + u.name);
    });
  }

  delete(subject: Subject) {
    if (confirm('Slett?\nBytt ut denne')) {
      this.subjectService.deleteSubject(subject.code).subscribe((res) => {
        this.ngOnInit();
      });
    }
  }

  created(subject: Subject) {
    this.subjects.unshift(subject);
    this.activePane = 'all';
  }

  saved() {
    this.router.navigate(['AdminOption2Path',{component: 'subjects', action: 'all'}]);
  }
  canceled() {
    this.router.navigate(['AdminOption2Path',{component: 'subjects', action: 'all'}]);
  }
}
