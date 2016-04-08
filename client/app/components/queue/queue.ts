import {Injector, Component, Output, EventEmitter, OnInit} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {AuthService} from '../../services/auth.service';
import {Queue} from '../../interfaces/subject';
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
  @Output() toggleQueue = new EventEmitter();
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
    this.queue.active = !this.queue.active;
  }
  addElement(users: User[]) {
    //this.subjectService.addQueueElement(users);
  }
  removeElement(element: any) {
    //Make sure we find the element, or else the last element would be deleted.
    if (this.queue.list.indexOf(element) != -1) {
      this.queue.list.splice(this.queue.list.indexOf(element), 1);
    }
    //this.subjectService.removeQueueElement(element);
  }
  helpQueueElement() {
    console.error('Error: QueueComponent.helpQueueElement not implemented!');
  }
  delayQueueElement() {
    console.error('Error: QueueComponent.delayQueueElement not implemented!');
  }
  acceptTask() {
    console.error('Error: QueueComponent.acceptTask not implemented!');
  }
}
