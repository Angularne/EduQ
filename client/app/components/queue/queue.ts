import {Injector, Component, Output, EventEmitter} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';
import {AuthService} from '../../services/auth.service';
import {Queue} from '../../interfaces/queue';
import {QueueElementComponent} from '../queue-element/queue-element';


@Component({
  selector: 'queue',
  templateUrl: 'app/components/queue/queue.html',
  inputs: ['queueObj'],
  directives: [QueueElementComponent]
})

export class QueueComponent {
  queueObj: Queue;
  @Output() toggleQueue = new EventEmitter();
  toggleQueueButton() {
    this.queueObj.active = !this.queueObj.active;
  }
  //TODO - interaction with queue.list is only local, move to backend
  addElement() {
    this.queueObj.list.push({
      users: null,
      timeEntered: new Date()
    })
  }
  removeElement(element: any) {
    //Make sure we find the element, or else the last element would be deleted.
    if (this.queueObj.list.indexOf(element) != -1) {
      this.queueObj.list.splice(this.queueObj.list.indexOf(element), 1);
    }
  }
}
