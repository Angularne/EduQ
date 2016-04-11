import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Request, RequestMethod} from "angular2/http";
import {User} from '../interfaces/user';
import {Subject} from '../interfaces/subject';
import {Queue, Broadcast} from '../interfaces/subject';
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

      this.socket.on('queue', (data) => {console.log(data);;});

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
       headers: authHeaders()
     });
  }

  deleteFromQueue() {
    this.http.delete(`api/subject/${this.subject.code}/queue`, {
       headers: authHeaders()
     });
  }

  removeQueueElement(element: any) {
    this.http.delete(`api/subject/${this.subject.code}/queue/${element._id}`, {
       headers: authHeaders()
     });
  }

  helpQueueElement(element: any) {
    this.http.put(`api/subject/${this.subject.code}/queue/${element._id}`, "", {
       headers: authHeaders()
     });
  }

  acceptTask(element: any) {
    var json = {
      "users": element.users,
      "tasks": element.tasks
    }
    this.http.post(`api/subject/${this.subject.code}/task`, JSON.stringify(json), {
       headers: authHeaders()
     }).subscribe();
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
       headers: authHeaders()
     }).subscribe();
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

  getSubject(code: string, select: string = null, populate: string = null){
    let url = '/api/subject/' + code + '?'
    + (select ? 'select=' + select + '&': '')
    + (populate ? 'populate=' + populate : '');

    return this.http.get(url, {headers: authHeaders()}).map(res=>{
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });
  }

  getAllSubjects(q: any = null, select: string = null, populate: string = null) {
    //return new Promise<Subject[]>((resolve, reject) => {
    let url = '/api/subject?'
    + (q ? 'q=' + JSON.stringify(q) + '&': '')
    + (select ? 'select=' + select + '&': '')
    + (populate ? 'populate=' + populate : '');

    return this.http.get(url, {headers: authHeaders()}).map(res=>{
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
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

  saveSubject(subject: Subject) {
    var request: Request = new Request({
      url: '/api/subject/',
      headers: authHeaders(),
      body: JSON.stringify(subject)
    });

    if (subject._id) {
      // _id exists - update user
      request.method = RequestMethod.Put;
      request.url += subject.code;
    } else {
      // create new subject
      request.method = RequestMethod.Post;
    }

    return this.http.request(request).map((res) => {
      if (res.status == 200 || res.status == 201) {
        // Subject saved
        return res.json();
      } else {
        // Error
        console.error(res);
        return false;
      }
    });
  }
}
