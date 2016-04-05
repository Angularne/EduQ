import {Component, OnInit, Input} from 'angular2/core';
import {SubjectService} from '../../services/subject';
import {Subject} from '../../interfaces/subject';
import {User} from '../../interfaces/user';
import {UserService} from '../../services/user';

@Component({
  selector: 'edit-subject-users',
  templateUrl: 'app/components/edit.subject.users/edit.subject.users.html',
  directives: []
})
export class EditSubjectUsersComponent implements OnInit {
  @Input() students: User[];
  @Input() assistents: User[];
  @Input() teachers: User[];

  constructor(private subjectService: SubjectService, private userService: UserService) { }



  ngOnInit() {

  }

}
