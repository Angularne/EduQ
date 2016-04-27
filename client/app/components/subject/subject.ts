import {Component, OnInit, OnDestroy} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {SubjectService} from '../../services/subject.service';
import {Subject} from '../../interfaces/subject';
import {User} from '../../interfaces/user';
import {QueueComponent} from './queue/queue';
import {BroadcastComponent} from './broadcasts/broadcasts';
import {EditSubjectComponent} from '../edit.subject/edit.subject';
import {SocketService} from '../../services/socket.service';
import {QueueService} from '../../services/queue.service';
import {BroadcastService} from '../../services/broadcast.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subject/subject.html',
  providers: [SubjectService, SocketService, QueueService, BroadcastService],
  directives: [QueueComponent, BroadcastComponent, EditSubjectComponent, ROUTER_DIRECTIVES]
})

export class SubjectsComponent implements OnInit, OnDestroy {
  subject: Subject;
  subjectString: string;
  role: string;
  user: User;

  constructor(private params: RouteParams,
              private auth: AuthService,
              private subjectService: SubjectService,
              private socket: SocketService,
              private queueService: QueueService,
              private broadcastService: BroadcastService) {}


  ngOnInit(){
    console.log('ngOnInit');
    let code = this.params.get('code');
    if (code) {
      this.subjectService.getSubject(code).subscribe((sub) => {
        this.subject = sub;
        this.queueService.subject = this.subject;
        this.broadcastService.subject = this.subject;
        this.socket.open(this.subject);
      });

      this.auth.getUser().then((user) => {
        this.user = user;

        for (let sub of this.user.subjects) {
          if (sub.code == code) {
            this.role = sub.role;
          }
        }
      });


    }
  }

  ngOnDestroy(){
    this.socket.close();


  }
}
