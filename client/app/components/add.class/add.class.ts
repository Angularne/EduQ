import {Component, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {UserService} from '../../services/user.service';
import {User} from '../../interfaces/user';


@Component({
  selector: 'add-class',
  templateUrl: 'app/components/add.class/add.class.html'
})
export class AddClassComponent {
  input: string = '';
  class: string;

  errorMsg: string;

  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UserService, private router: Router) { }



  save() {
    var users: User[] = [];

    for (let u1 of this.input.split('\n')) {
      let u2 = u1.split(',');

      if (u1 == '') {
        continue; //Skip
      } else if (u2.length != 3 || !u2[0] || !u2[1] || !u2[2]) {
        this.errorMsg = 'Error in input: ' + u1;
        return;
      }

      let user : User = {
        firstname: u2[0],
        lastname: u2[1],
        email: u2[2],
        rights: 'Student',
        classOf: this.class
      }



      users.push(user);
    }
    if (users.length) {
      this.userService.saveUsers(users).subscribe(res => {
        this.saved.emit(null);
        this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName]);
      });
    } else {
      this.saved.emit(null);
      this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName]);
    }
  }

  cancel() {
    this.canceled.emit(null);
    this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName]);
  }
}
