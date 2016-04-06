import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Request, RequestMethod} from "angular2/http";
import {Subject} from '../interfaces/subject';
import {User} from "../interfaces/user";
import {AuthService} from './auth.service';
import {authHeaders} from '../common/headers';
@Injectable()
export class UserService {
  user: User;


  constructor(public http: Http, public authService: AuthService) {
    this.authService.authenticated$.subscribe((auth) => {
      if (auth) {
        this.authService.getUser().then((user) => {
          this.user = user;
        }).catch((err)=>{});
      } else {
        this.user = null;
      }
    });
  }

  fetchUser() {
    return this.http.get('/api/user', {
       headers: authHeaders()
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
        //this.fetchUser().subscribe((user) => resolve(user));
        this.authService.getUser().then((user) => {
          this.user = user;
          resolve(user);
        }).catch((err)=>{
          reject(err);
        })
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

  getAllUsers() {

    return new Promise<User[]>((resolve, reject) => {
      this.http.get('/api/user/all', {headers: authHeaders()}).map(res=>{
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

  saveUser(user: User) {
    var request: Request = new Request({
      url: '/api/user/',
      headers: authHeaders(),
      body: JSON.stringify(user)
    });

    if (user._id) {
      // _id exists - update user
      request.method = RequestMethod.Put;
      request.url += user._id;
    } else {
      // create new user
      request.method = RequestMethod.Post;
    }

    return this.http.request(request).map((res) => {

      if (res.status == 200 || res.status == 201) {
        // User saved
        return res.json();
      } else {
        // Error
        console.error(res);
        return false;
      }
    });
  }

}
