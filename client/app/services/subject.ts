import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from "angular2/http";
import {User} from '../interfaces/user';
import {Subject} from '../interfaces/subject';
import {Queue} from '../interfaces/queue';
import {Broadcast} from '../interfaces/broadcast';
import {AuthService} from './auth.service';
import {UserService} from './user';
import {Binding} from './binding';
import {authHeaders} from '../common/headers';

let SERVER_ADDRESS = 'http://158.38.188.119:3001';

@Injectable()
export class SubjectService {

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
    this.http.post(`api/subject/${this.subject.code}/queue`, JSON.stringify(users), {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     });
  }

  deleteFromQueue() {
    this.http.delete(`api/subject/${this.subject.code}/queue`, {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     });
  }

  removeQueueElement(element: any) {
    this.http.delete(`api/subject/${this.subject.code}/queue/${element._id}`, {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     });
  }

  helpQueueElement(element: any) {
    this.http.put(`api/subject/${this.subject.code}/queue/${element._id}`, "", {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     });
  }

  acceptTask(element: any) {
    var json = {
      "users": element.users,
      "tasks": element.tasks
    }
    this.http.post(`api/subject/${this.subject.code}/task`, JSON.stringify(json), {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     });
  }

  delayQueueElement(places: number) {
    console.error('Error: SubjectService.delayQueueElement not implemented!');
    //this.socket.emit('delayQueueElement', places);
  }

  toggleQueueActive(active: boolean) {
    var json = {
      "activate": !active
    }
    this.http.put(`api/subject/${this.subject.code}/queue`, JSON.stringify(json), {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     });
  }


  subject: Subject;
  queue: Binding<Queue> = new Binding<Queue>();
  broadcasts: Binding<Broadcast[]> = new Binding<Broadcast[]>();
  students: Binding<User[]> = new Binding<User[]>();

  constructor(public http: Http, public authService: AuthService, public userService: UserService) {
    //this.setupSocket();
  }

  fetchSubject(code: string) {
    return this.http.get(`api/subject/${code}`, {
       headers: authHeaders()
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

  getAllSubjects() {
    return new Promise<Subject[]>((resolve, reject) => {
      this.http.get('/api/subject/', {headers: authHeaders()}).map(res=>{
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }

      }).subscribe((res)=>{
        if (res) {
          resolve(res);
        } else {
          reject(false);
        }
      });
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

  addNewSubject(subject:Subject){
    return new Promise<Subject>((resolve, reject) => {
      this.http.post("api/subject/",JSON.stringify(subject), {headers: authHeaders()}).subscribe((res)=>{
        if(res.status==201){
          resolve(res.json());
        }else{
          reject(res);
        }
      });
    });
  }

  updateSubject(subject: Subject) {
    return new Promise<Subject>((resolve, reject) => {
      this.http.put("api/subject/" + subject.code,JSON.stringify(subject), {headers: authHeaders()}).subscribe((res)=>{
        if(res.status==201){
          resolve(res.json());
        }else{
          reject(res);
        }
      });
    });
  }
}
