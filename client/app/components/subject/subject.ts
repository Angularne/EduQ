import {Component, OnInit, OnDestroy} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {SubjectService} from '../../services/subject.service';
import {Subject, Task} from '../../interfaces/subject';
import {User} from '../../interfaces/user';
import {Location} from "../../interfaces/location";
import {QueueComponent} from './queue/queue';
import {BroadcastComponent} from './broadcasts/broadcasts';
import {EditSubjectComponent} from '../edit.subject/edit.subject';
import {SocketService} from '../../services/socket.service';
import {QueueService} from '../../services/queue.service';
import {BroadcastService} from '../../services/broadcast.service';
import {AuthService} from '../../services/auth.service';
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subject/subject.html',
  providers: [SubjectService, SocketService, QueueService, BroadcastService],
  directives: [QueueComponent, BroadcastComponent, EditSubjectComponent]
})

export class SubjectsComponent implements OnInit, OnDestroy {
  subject: Subject;
  subjectString: string;
  role: string;
  user: User;
  tasks: Task[];
  userTasks: Task[];
  locations: Location[] = [];

  constructor(private params: RouteParams,
              private auth: AuthService,
              private subjectService: SubjectService,
              private socket: SocketService,
              private queueService: QueueService,
              private broadcastService: BroadcastService,
              private locationService: LocationService) {}


  ngOnInit(){
    let code = this.params.get('code');
    if (code) {
      this.subjectService.getSubject(code).subscribe((sub) => {
        this.subject = sub;
        this.tasks = sub.tasks;
        this.queueService.subject = this.subject;
        this.broadcastService.subject = this.subject;
        this.socket.open(this.subject);
      });

      this.auth.getUser().then((user) => {
        this.user = user;
        for (let sub of this.user.subjects) {
          if (sub.code == code) {
            this.userTasks = sub.tasks;
            this.role = sub.role;
            console.log("getUser async find role");
          }
        }
      }).catch((err) => {console.log("getUser error");}); // TODO sometimes this runs...

      // this.locationService.getLocations(code).subscribe((locations) => {
      //   this.locations = locations
      // });

    }
  }

  ngOnDestroy(){
    this.socket.close();
  }
}
