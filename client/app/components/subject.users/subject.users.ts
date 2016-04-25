import {Component, OnInit} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {SubjectService} from '../../services/subject.service';
import {UserService} from '../../services/user.service';
import {User} from '../../interfaces/user';
import {Subject} from '../../interfaces/subject';


@Component({
  selector: 'subject-users',
  templateUrl: 'app/components/subject.users/subject.users.html',
  directives: [ROUTER_DIRECTIVES]
})
export class SubjectUsersComponent implements OnInit {
  subject: Subject;
  all: UserSelect[];
  users: UserSelect[] = [];

  // Filter
  year: string;
  query: string;


  allSelected: boolean = false;


  constructor(private routeParams: RouteParams, private subjectService: SubjectService, private userService: UserService) { }

  ngOnInit(){
    let code = this.routeParams.params['code'];

    var subjectAndUsers = -2;
    let done = () => {
      if (!++subjectAndUsers) {
          this.setSelectedUsers();
      }
    }

    this.subjectService.getSubject(code).subscribe((sub) => {
      this.subject = sub;
      done();
    });

    this.userService.getAllUsers().subscribe((users) => {
      this.all = users.filter((val)=> { return val.rights == 'Student'});
      this.users = this.all;
      done();
    });
  }

  setSelectedUsers() {
    for (let user1 of this.subject.users) {
      for (let user2 of this.all) {
          if (user1._id == user2._id && user1.role == 'Student') {
            user2.selected = true;
            break;
          }
      }
    }
  }


  doFilter() {
    this.allSelected = false;


    let queries = this.query.split(' ');
    let qs: RegExp[] = [];
    for (let q of queries) {
        qs.push(new RegExp(q, 'i'));
    }


    let y = new RegExp(this.year);

    this.users = this.all.filter((value: User, index: number, array: User[]) => {
      if (!y.test(value.classOf)) {
        return false;
      }

      for (let q of qs) {
          if (!q.test(value.firstname+value.lastname+value.classOf+value.email)) {
            return false;
          }
      }
/*
      let name = value.firstname + ' ' + value.lastname;
      if (!q.test(name)) {
        return false;
      }

*/

      return true;
    });
  }

  selectAll(selected: boolean) {
    console.log(selected);
    for (let user of this.users) {
        user.selected = selected;
    }
  }


  save() {
    var selectedUsers: string[] = [];

    for (let user of this.all) {
      if (user.selected)
        selectedUsers.push(user._id);
    }


    this.subjectService.updateStudents(this.subject.code, selectedUsers).subscribe((val) => {

    });
  }

}



interface UserSelect extends User {
  selected: boolean;
}
