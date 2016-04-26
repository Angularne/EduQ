import {Component} from 'angular2/core';
import {UserService} from '../../services/user.service';
import {User} from '../../interfaces/user';


@Component({
  selector: 'add-class',
  templateUrl: 'app/components/add.class/add.class.html'
})
export class AddClassComponent {
  input: string;
  class: string;

  constructor(private userService: UserService) { }



  save() {
    var users: User[] = [];

    for (let u1 of this.input.split('\n')) {
      let u2 = u1.split(',');

      let user : User = {
        firstname: u2[0],
        lastname: u2[1],
        email: u2[2],
        rights: 'Student',
        classOf: this.class
      }

      users.push(user);
    }

    this.userService.saveUsers(users).subscribe(res => {

    });
  }
}
