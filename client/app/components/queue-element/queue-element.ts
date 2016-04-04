import {Component, Output, EventEmitter} from 'angular2/core';
import {UserService} from "../../services/user";
import {User} from "../../interfaces/user";

@Component({
  selector: 'queue-element',
  template: `
  {{element.timeEntered}} <span *ngFor="#user of element?.users"> - {{user.firstname}} </span> <button *ngIf="mine" (click)="removeElementButton()">X</button>
  `,
  inputs: ['element']
})
export class QueueElementComponent {
  element: any;
  user: User;
  mine: boolean = false;
  @Output() removeElement = new EventEmitter();
  constructor(public userservice: UserService) {
    this.userservice.getUser().then((user) => {
      this.user = user;
      this.checkIfMyUser();
    })
  }
  removeElementButton() {
    this.removeElement.emit('event');
  }
  checkIfMyUser() {
    for (var i = 0; i < this.element.users.length; i++) {
      if (this.user.firstname === this.element.users[i].firstname && this.user.lastname === this.element.users[i].lastname) {
        return this.mine = true;
      }
    }
    return false;
  }
}
