import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../interfaces/user';
import {ConfirmModalOptions, ConfirmModalComponent} from '../../../confirm.modal/confirm.modal';


@Component({
  selector: 'admin-users-all',
  templateUrl: 'app/components/admin/users/all/all.html',
  directives: [ROUTER_DIRECTIVES, ConfirmModalComponent]
})
export class AdminUsersAllComponent {
  users: User[];
  filteredUsers: User[];
  activePane: string = 'all';



  /** Modal */
  modal: ConfirmModalOptions = {};

  constructor(private userService: UserService) { }

  ngOnInit(){
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
    /** Setup modal */
    this.modal = {
      title: 'Delete User',
      body: 'Are you sure you want to delete user ' + user.firstname + ' ' + user.lastname + '?',
      confirmed: (con) => {
        if (con) {
          this.userService.deleteUser(user._id).subscribe((res) => {
            this.ngOnInit();
          });
        }
      }
    };

    /** HACK:  as any*/
    ($('#confirmModal') as any).modal('show');
  }

  ngOnDestroy() {
    ($('.modal-backdrop') as any).remove();
  }

}
