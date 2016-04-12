import {Injector, Component, OnInit, Input} from 'angular2/core';
import {AuthService} from '../../../services/auth.service';
import {Queue} from '../../../interfaces/subject';
import {User} from '../../../interfaces/user';
import {SubjectUser} from '../../../interfaces/subject';
import {SubjectService} from '../../../services/subject.service';
import {UserService} from '../../../services/user.service';
import {QueueService} from '../../../services/queue.service';

@Component({
  selector: 'queue',
  templateUrl: 'app/components/subject/queue/queue.html'
})

export class QueueComponent{
  @Input() queue: Queue;
  students: User[] = [];
  usersSelected: User[] = [];
  mine: boolean = false;
  user: User;
  myUserInQueue: boolean = false;
  userRole: string = 'Student';

  constructor(public subjectService: SubjectService, public userService: UserService, public auth: AuthService, private queueService: QueueService) {



    this.subjectService.students.subscribe((value) => {
      this.students = value as any;
    })
    this.auth.getUser().then((user) => {
      this.user = user;
    })
  }

  checkMyUserInQueue() {
    for (var i = 0; i < this.queue.list.length; i++) {
      if (this.queue.list[i].users.indexOf(this.user) != -1) this.myUserInQueue = true;
    }
  }

  selectUser(user: User) {
    if (this.usersSelected.indexOf(user) === -1) {
      this.usersSelected.push(user);
    }
  }
  unselectUser(user: User) {
    var index = this.usersSelected.indexOf(user);
    if (index != -1) {
      this.usersSelected.splice(index, 1);
    }
  }

  checkIfMyUser(element: any) {
    var index = this.queue.list.indexOf(element);
    for (var i = 0; i < element.users.length; i++) {
      if (this.user.firstname === element.users[i].firstname && this.user.lastname === element.users[i].lastname) {
        return this.mine = true;
      }
    }
    return false;
  }

  checkIfAuth() {
    this.userService.getUserRole(this.subjectService.subject.code).then((role) => {
      if (role == 'Teacher' || role == 'Assistant') {
        return true;
      }
      return false;
    });
  }

  toggleQueueButton() {
    this.queueService.toggleQueueActive(this.queue.active);
  }
  addQueueElement() {
    this.queueService.addQueueElement(this.usersSelected);
  }
  deleteFromQueue() {
    this.queueService.deleteFromQueue();
  }
  removeQueueElement(element: any) {
    this.queueService.removeQueueElement(element);
  }
  helpQueueElement(element: any) {
    this.queueService.helpQueueElement(element);
  }
  delayQueueElement() {
    console.error('Error: QueueComponent.delayQueueElement not implemented!');
  }
  acceptTask(element: any) {
    console.error('Error: QueueComponent.acceptTask not implemented!');
  }
}
