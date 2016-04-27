import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {AddClassComponent} from '../../add.class/add.class';
import {EditUserComponent} from '../../edit.user/edit.user';
import {UserService} from '../../../services/user.service';
import {User} from '../../../interfaces/user';

@Component({
  selector: 'admin-users',
  templateUrl: 'app/components/admin/users/users.html',
  directives: [AddClassComponent, EditUserComponent, ROUTER_DIRECTIVES]
})
export class AdminUsersComponent implements OnInit {
  users: User[];
  filteredUsers: User[];
  activePane: string = 'all';

  selected: User;

  constructor(private userService: UserService, private routeParams: RouteParams, private router: Router) { }

  ngOnInit(){
    let pane = this.routeParams.get('action') || 'all';

    if (pane == 'edit') {
      let id = this.routeParams.get('id');
      if (id) {
        this.activePane = pane
      }
    } else {
      this.activePane = pane;
    }

    this.userService.getAllUsers().subscribe(res => {
      this.users = res;
      this.filteredUsers = res;
    });
  }

  filter(query: string) {
    let regexp = new RegExp(query, 'i');

    this.filteredUsers = this.users.filter(u => {
      return regexp.test(u.firstname + ' ' + u.lastname);
    });
  }

  delete(user: User) {
    if (confirm('Slett?\nBytt ut denne')) {
      this.userService.deleteUser(user._id).subscribe((res) => {
        this.ngOnInit();
      });
    }
  }


  created(user: User) {
    this.users.unshift(user);
    this.activePane = 'all';
  }

  saved() {
    this.router.navigate(['AdminOption2Path',{component: 'users', action: 'all'}]);
  }
  canceled() {
    this.router.navigate(['AdminOption2Path',{component: 'users', action: 'all'}]);
  }
}
