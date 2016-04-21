import {Injector, Component, OnInit, Input, OnChanges} from 'angular2/core';
import {AuthService} from '../../../services/auth.service';
import {Queue} from '../../../interfaces/subject';
import {User, UserSubject} from '../../../interfaces/user';
import {SubjectUser, Task, Subject} from '../../../interfaces/subject';
import {SubjectService} from '../../../services/subject.service';
import {UserService} from '../../../services/user.service';
import {QueueService} from '../../../services/queue.service';

@Component({
  selector: 'queue',
  templateUrl: 'app/components/subject/queue/queue.html'
})

export class QueueComponent implements OnInit, OnChanges {
  @Input() queue: Queue;
  @Input() user: User; //async - makes problems if not found before other inputs
  @Input() role: string;
  _tasksSorted: boolean = false;
  _tasks: Task[] = [];
  @Input() set tasks(tasks) {
    if (this.user && !this._tasksSorted && this.role === 'Student') {
      if (tasks) {
        this._tasks = tasks.filter((value: Task, index: number, array: Task[]) => {
          return !this.haveIDoneThatTask(value);
        });
        this._tasksSorted = true;
      }
    }
  }
  get tasks() {return this._tasks;}
  _tasksIHaveDone: Task[];
  @Input() set userTasks(userTasks) {
    this._tasksIHaveDone = userTasks;
  }
  get userTasks() {return this._tasksIHaveDone;}
  haveIDoneThatTask(task: Task) {
    if (!this._tasksIHaveDone) {
      console.log(this);
      for (let sub of this.user.subjects) {
        if (sub.code === this.subjectService.subject.code) {
          this._tasksIHaveDone = sub.tasks;
          break;
        }
      }
    } else if(this._tasksIHaveDone.length > 0) {
      for ( let t of this._tasksIHaveDone) {
        if (t.number === task.number) {
          return true;
        }
      }
    }

    return false;
  }
  _studentsSorted: boolean = false;
  _students: SubjectUser[] = [];
  @Input() set students(users) {
    if (users && this.user && !this._studentsSorted) {
      console.log("set students()");
      this._students = users.filter((value: SubjectUser, index: number, array: SubjectUser[]) => {
        return value.role == 'Student' && value._id != this.user._id;
      });
      this._studentsSorted = true;
    } else {this._students = users;}
  }
  get students() {return this._students;}

  _studentsNotInQueue: SubjectUser[] = [];
  get studentsNotInQueue() {return this._studentsNotInQueue;}
  set studentsNotInQueue(users) {
    if (users) {
      this._studentsNotInQueue = users.filter((value: SubjectUser, index: number, array: SubjectUser[]) => {
        return this.checkUserInQueue(value);
      });
    }
  }
  _taskSelected: Task = null;
  usersSelected: User[] = [];
  mine: boolean = false;
  myUserInQueue: boolean = false;
  userRole: string = 'Student';

  constructor(private subjectService: SubjectService,
              private auth: AuthService,
              private queueService: QueueService) {
}

  slidervalue: number = 2;
  onSlide(value: number) {
    this.slidervalue = value;
  }

  ngOnInit() {
  }

  ngOnChanges(){
    this.checkMyUserInQueue();
    this.studentsNotInQueue = this.students;
    if (this.subjectService.subject) {
      this.tasks = this.subjectService.subject.tasks;
    }
    this.students = this.students;
    console.log("Student role = " + this.role);
  }

  get teacherOrAssistent() {
    return this.role == 'Assistent' || this.role == 'Teacher';
  }

  checkMyUserInQueue() {
  if (this.queue && this.user) {
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

checkUserInQueue(listUser: SubjectUser) {
if (this.queue) {
  for (let q of this.queue.list) {
    for (let user of q.users) {
      if (user._id == listUser._id) {
        return false;
      }
    }
  }
}
return true;
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
  selectTask(task: Task) {
    this._taskSelected = task;
  }

  checkIfMyUser(element: any) {
    if (this.user) {
      var index = this.queue.list.indexOf(element);
      for (var i = 0; i < element.users.length; i++) {
        if (this.user._id === element.users[i]._id) {
          return this.mine = true;
        }
      }
    }
    return false;
  }


  toggleQueueButton() {
    this.queueService.toggleQueueActive(this.queue.active);
  }
  addQueueElement() {
    this.queueService.addQueueElement(this.usersSelected, this._taskSelected);
    this.usersSelected = [];
  }
  deleteFromQueue() {
    this.queueService.deleteFromQueue();
    this._taskSelected = null;
  }
  removeQueueElement(element: any) {
    this.queueService.removeQueueElement(element);
    this._taskSelected = null;
  }
  helpQueueElement(element: any) {
    this.queueService.helpQueueElement(element);
  }
  delayQueueElement(element: any, places: number) {
    console.error('Error: QueueComponent.delayQueueElement not implemented!');
  }
  acceptTask(element: any) {
    console.error('Error: QueueComponent.acceptTask not implemented!');
  }
}
