import {Injectable, Inject} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, Response} from "angular2/http";
import {authHeaders} from '../common/headers';
import {User} from '../interfaces/user';
import {Binding} from '../common/binding';

@Injectable()
export class AuthService {

  get authenticated() {
    return this.authenticated$.value;
  }
  authenticated$ : Binding<boolean> = new Binding<boolean>(false);
  user: User;

  get token() {
    return sessionStorage.getItem('authToken');
  }
  set token(t: string) {
    if (t != undefined) {
      sessionStorage.setItem('authToken', t);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }

  constructor(private http: Http) {
    this.authenticate();
  }

  authenticate() : Promise<boolean>;
  authenticate(token: string) : Promise<boolean>;
  authenticate(username: string, password: string) : Promise<boolean>;
  authenticate(usernameOrToken: string = undefined, password: string = undefined) : Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        var token: string;

        if (usernameOrToken && password) {
          token = btoa(`${usernameOrToken}:${password}`);
        } else if (usernameOrToken){
          token = usernameOrToken;
        } else if (this.authenticated) {
          return resolve(true);
        } else if (this.token){
          token = this.token;
        } else {
          return resolve(false);
        }

        this.http.post('/api/auth/login', '', {
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': `Basic ${token}`
            })
          })
          .subscribe((res) => {
            if (res.status == 200) {
              this.token = token;
              this.authenticated$.value = true;

            } else {
              this.token = undefined;
              this.authenticated$.value = false;
            }
            resolve(this.authenticated);
          });
      });
  }

  logout() {

    this.token = undefined;
    this.user = undefined;
    this.authenticated$.value = false;
    return Observable.of(true);
  }

  getUser() {
    return new Promise<User>((resolve, reject) => {
      this.authenticate().then((authenticated) => {
        if (authenticated) {
          // Authenticated
          if (this.user) {
            // User cached
            resolve(this.user);
          } else {
            // Get user
            this.http.get('/api/user/me', {
              headers: this.headers
            }).subscribe((res) => {
              if (res.status == 200) {  // OK
                this.user = res.json()
                resolve(this.user);
              } else {
                reject(res.statusText);
              }
             });
           }
        } else {
          reject('not authenticated');
        }
      });
    });
  }


  get headers() {
    let headers = new Headers();
    let batoken = this.token;
    if (batoken) {
      headers.append('Authorization', `Basic ${batoken}`);
    }
    headers.append('Content-Type', 'application/json');
    return headers;
  }
}
