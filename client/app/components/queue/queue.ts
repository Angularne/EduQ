import {Injector, Component, Output, EventEmitter} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {isLoggedin}  from '../main/is-loggedin';
import {AuthService} from '../../services/auth.service';
import {Queue} from '../../interfaces/queue';
import {QueueElementComponent} from '../queue-element/queue-element';
import {SubjectService} from '../../services/subject';


@Component({
  selector: 'queue',
  templateUrl: 'app/components/queue/queue.html',
  directives: [QueueElementComponent]
})

export class QueueComponent {
  queue: Queue;
  @Output() toggleQueue = new EventEmitter();
  constructor(public subjectService: SubjectService) {
    this.subjectService.queue.subscribe((value) => {
      this.queue = value;
    })
  }
  toggleQueueButton() {
    this.queue.active = !this.queue.active;
  }
  //TODO - interaction with queue.list is only local, move to backend
  addElement() {

  }
  removeElement(element: any) {
    //Make sure we find the element, or else the last element would be deleted.
    if (this.queue.list.indexOf(element) != -1) {
      this.queue.list.splice(this.queue.list.indexOf(element), 1);
    }
  }
}
