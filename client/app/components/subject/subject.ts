import {Component, OnInit, OnDestroy} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {SubjectService} from '../../services/subject.service';
import {Subject} from '../../interfaces/subject';
import {QueueComponent} from './queue/queue';
import {BroadcastComponent} from './broadcasts/broadcasts';
import {EditSubjectComponent} from '../edit.subject/edit.subject';
import {SocketService} from '../../services/socket.service';
import {QueueService} from '../../services/queue.service';
import {BroadcastService} from '../../services/broadcast.service';

@Component({
  selector: 'subjects',
  templateUrl: 'app/components/subject/subject.html',
  providers: [SubjectService, SocketService, QueueService, BroadcastService],
  directives: [QueueComponent, BroadcastComponent, EditSubjectComponent]
})

export class SubjectsComponent implements OnInit, OnDestroy {
  subject: Subject;
  subjectString: string;
  userRole: string;

  constructor(private params: RouteParams,
              public subjectService: SubjectService,
              private socket: SocketService,
              private queueService: QueueService) {}



  ngOnInit(){
    let code = this.params.get('code');
    if (code) {
      this.subjectService.getSubject(code).subscribe((sub) => {
        this.subject = sub;
        this.queueService.subject = this.subject;
        this.socket.open(this.subject);
      });

      this.subjectService.getUserSubjectRole(code).then((sub) => {
        this.userRole = sub;
      });
    }
  }

  ngOnDestroy(){
    this.socket.close();
  }
}
