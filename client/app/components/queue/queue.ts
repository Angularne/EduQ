import {Injector, Component, Output, EventEmitter, OnInit} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';
import {AuthService} from '../../services/auth.service';
import {Queue} from '../../interfaces/queue';
import {User} from '../../interfaces/user';
import {QueueElementComponent} from '../queue-element/queue-element';
import {SubjectService} from '../../services/subject';


@Component({
  selector: 'queue',
  templateUrl: 'app/components/queue/queue.html',
  directives: [QueueElementComponent]
})

export class QueueComponent{
  queue: Queue;
  students: User[] = [];
  usersSelected: User[] = [];
  constructor(public subjectService: SubjectService) {
    this.subjectService.queue.subscribe((value) => {
      this.queue = value;
    });
    this.subjectService.students.subscribe((value) => {
      this.students = value;
    })
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

  toggleQueueButton() {
    this.subjectService.toggleQueueActive(this.queue.active);
  }
  addQueueElement() {
    this.subjectService.addQueueElement(this.usersSelected);
  }
  deleteFromQueue() {
    this.subjectService.deleteFromQueue();
  }
  removeQueueElement(element: any) {
    this.subjectService.removeQueueElement(element);
  }
  helpQueueElement() {
    console.error('Error: QueueComponent.helpQueueElement not implemented!');
  }
  delayQueueElement() {
    console.error('Error: QueueComponent.delayQueueElement not implemented!');
  }
  acceptTask(element: any) {
    console.error('Error: QueueComponent.acceptTask not implemented!');
  }
}
