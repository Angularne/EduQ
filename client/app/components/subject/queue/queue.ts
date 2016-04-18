import {Injector, Component, OnInit, Input, OnChanges} from 'angular2/core';
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

export class QueueComponent implements OnInit, OnChanges {
  @Input() queue: Queue;
  @Input() user: User;
  @Input() role: string;

  _students: SubjectUser[] = [];
  @Input() set students(users) {
    if (users) {
      this._students = users.filter((value: SubjectUser, index: number, array: SubjectUser[]) => {
        return value.role == 'Student' && value._id != this.user._id;
      });
    }
  }
  get students() {return this._students;}

  usersSelected: User[] = [];
  mine: boolean = false;
  myUserInQueue: boolean = false;
  userRole: string = 'Student';

  constructor(private subjectService: SubjectService,
              private auth: AuthService,
              private queueService: QueueService) {
}


  ngOnInit() {

  }

  ngOnChanges(){

    this.checkMyUserInQueue();
  }

  get teacherOrAssistent() {
    return this.role == 'Assistent' || this.role == 'Teacher';
  }

  checkMyUserInQueue() {
  if (this.queue) {
    for (let q of this.queue.list) {
      for (let user of q.users) {
        if (user._id == this.user._id) {
          this.myUserInQueue = true;
          return;
        }
      }
    }
  }
  this.myUserInQueue = false;
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
      if (this.user._id === element.users[i]._id) {
        return this.mine = true;
      }
    }
    return false;
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
