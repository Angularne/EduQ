import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from "angular2/http";
import {User} from '../interfaces/user';
import {Subject} from '../interfaces/subject';
import {Queue} from '../interfaces/queue';
import {Broadcast} from '../interfaces/broadcast';
import {AuthService} from './auth.service';
import {UserService} from './user';
import {Binding} from './binding';

let SERVER_ADDRESS = 'http://158.38.188.119:3001';

@Injectable()
export class SubjectService {
/*
  private socket: SocketIOClient.Socket;

  private setupSocket() {
    console.log('setupSocket');
    if (!this.socket) {
      this.socket = io.connect(SERVER_ADDRESS);

      this.socket.on('init', (data) => {this.init(data);});
      this.socket.on('update', (data) => {this.update(data);});

    } else if (this.socket.disconnected) {
      this.socket.open();
    }
  }

  private init(data) {
    this.subject = data;
    this.queue.value = this.subject.queue;
    this.broadcasts.value = this.subject.broadcasts;
  }

  private update(data) {
    this.queue.value = data.queue;
    this.broadcasts.value = data.broadcasts;
  }

  addQueueElement(users: User[]) {
    console.error('Error: SubjectService.addQueueElement not implemented!');
    //this.socket.emit('addQueueElement', users);
  }

  removeQueueElement(element: any) {
    console.error('Error: SubjectService.removeQueueElement not implemented!');
    //this.socket.emit('removeQueueElement', element);
  }

  helpQueueElement() {
    console.error('Error: SubjectService.helpQueueElement not implemented!');
    //this.socket.emit('helpQueueElement');
  }

  acceptTask() {
    console.error('Error: SubjectService.acceptTask not implemented!');
  }

  delayQueueElement(places: int) {
    console.error('Error: SubjectService.delayQueueElement not implemented!');
    //this.socket.emit('delayQueueElement', places);
  }

  toggleQueueActive() {
    console.error('Error: SubjectService.toggleQueueActive not implemented!');
    //this.socket.emit('toggleQueueActive');
  }
*/

  subject: Subject;
  queue: Binding<Queue> = new Binding<Queue>();
  broadcasts: Binding<Broadcast[]> = new Binding<Broadcast[]>();
  students: Binding<User[]> = new Binding<User[]>();

  constructor(public http: Http, public authService: AuthService, public userService: UserService) {
    console.log("ISubjectService");
    this.http = http;
    //this.setupSocket();
  }
  ///api/subject/${code}
//http://158.38.188.119:3000/api/subject/${code}
  fetchSubject(code: string) {
    return this.http.get(`api/subject/${code}`, {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     })
     .map((res : any) => {
       let data = res.json();
       this.subject = data;
       this.queue.value = this.subject.queue;
       this.broadcasts.value = this.subject.broadcasts;
       this.students.value = this.subject.students;
       return this.subject;
     });
  }

  getSubject(code: string){
    return new Promise<Subject>((resolve, reject) => {
      if (this.subject && this.subject.code === code) {
        resolve(this.subject);
      } else {
        this.fetchSubject(code).subscribe((sub)=>{resolve(sub)});
      }
    });
  }
  getUserSubjectRole(code: string) {
    return new Promise<string>((resolve, reject) => {
      if (this.subject && this.subject.code === code) {
        resolve(this.userService.getUserRole(code));
      } else {
        this.fetchSubject(code).subscribe(() =>resolve(this.userService.getUserRole(code)));
      }
    });
  }
}
