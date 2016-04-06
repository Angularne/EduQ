import {Injectable, Inject} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, Response} from "angular2/http";
import {authHeaders} from '../common/headers';
import {User} from '../interfaces/user';
import {Binding} from './binding';

@Injectable()
export class AuthService {

  get authenticated() {
    return this.authenticated$.value;
  }
  authenticated$ : Binding<boolean> = new Binding<boolean>(false);
  token: string;
  user: User;

  constructor(private http: Http) {
    this.token = sessionStorage.getItem("authToken")
    if (this.token) {
      this.http.get('/api/user/', {headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.token}`
      })})
      .subscribe((res) => {
          if (res.status == 200) {
            this.user = res.json();
            this.authenticated$.value = true;
          }
        });
    }
  }


  authenticate(username: string, password: string) {
    return new Promise<boolean>((resolve, reject) => {
      let authToken = btoa(`${username}:${password}`);

      this.http.post('/api/auth/login', '', {
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authToken}`
          })
        })
        .map(
          (res : Response) => {
            if (res.status == 200) {
              return true;
            }
            return false;
          }//,
          //(err) => {reject(err);}
        ).subscribe((res) => {
          if (res) {
            sessionStorage.setItem('authToken', authToken);
            this.token = authToken;
            this.authenticated$.value = true;

          } else {
            this.token = null;
            this.authenticated$.value = false;
          }
          resolve(this.authenticated);
        });
    });
  }

  logout() {

    this.token = null;
    this.user = null;
    sessionStorage.removeItem('authToken');
    this.authenticated$.value = false;
    return Observable.of(true);
  }

  getUser() {


    return new Promise<User>((resolve, reject) => {
      if (this.user) {
        return resolve(this.user);
      }

      if (this.authenticated) {
        this.http.get('/api/user', {
           headers: authHeaders()
         })
         .map((res) => {
           if (res.status == 200) {
             return res.json();
           }
           return false;
         }).subscribe((user) => {
           if (user) {
             resolve(user)
           } else {
             this.logout();
             reject(user);
           }
         });
       } else {
         reject(false);
       }
    });
  }

  refreshUser() {
    this.user = null;
    this.getUser();
  }


}
