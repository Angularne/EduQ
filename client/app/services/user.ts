import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from "angular2/http";
import {Subject} from '../interfaces/subject';
import {User} from "../interfaces/user";
import {AuthService} from './auth.service';

@Injectable()
export class UserService {
  user: User;


  constructor(public http: Http, public authService: AuthService) {
    console.log('UserService Constructor');
    this.fetchUser();
  }

  fetchUser() {
    return this.http.get('/api/user', {
       headers: new Headers({
         'x-access-token': this.authService.getToken()
       })
     })
     .map((res : any) => {
       let data = res.json();
       this.user = data;
       localStorage.setItem('user', JSON.stringify(this.user));
       return this.user;
     });
  }

  getUser() {
    return new Promise<User>((resolve, reject) => {
      if (!this.user) {
        this.fetchUser().subscribe((user) => resolve(user));
      } else {
        resolve(this.user);
      }
    });
  }

  removeLocalUser() {
    this.user = undefined;
    localStorage.removeItem('user');
  }
  getUserRole(code: string) {
    return new Promise<string>((resolve, reject) => {
      if (!this.user) {
        this.fetchUser();
      } else {
        var index = -1;
        for (var i = 0; i < this.user.subjects.length; i++) {
          if (this.user.subjects[i].subject.code === code) index = i;
        }
        if (index != -1) {
          resolve(this.user.subjects[index].role);
        }
      }
    });
  }
}


/*
var USER: User = {
    "firstname" : "Håvard",
    "lastname" : "Tollefsen",
    "email" : "ht",
    "password" : "test",
    "subjects" : [
      {
        "subject" : {
          "code" : "1",
          "name" : "Math",
          "broadcasts" : null,
          "queue" : null,
          "tasks" : null
        },
        "role" : null,
        "tasks" : null
      },
      {
        "subject" : {
          "code" : "2",
          "name" : "Nynorsk",
          "broadcasts" : null,
          "queue" : null,
          "tasks" : null
        },
        "role" : null,
        "tasks" : null
      }
    ]
}
*/
