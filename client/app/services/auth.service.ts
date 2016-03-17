import {Injectable, Inject} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, Response} from "angular2/http";

@Injectable()
export class AuthService {
  authenticated: boolean = false;
  token: string;
  http: Http;



  constructor(@Inject(Http) http: Http) {
    console.log('auth.service');
    this.token = localStorage.getItem('token');
    //this.authenticated = !!this.token;
    this.http = http;


    var authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      console.log('authenticating');
      this.http.post('/api/auth/login','')
        .map((res : any) => {
          console.log(res);
          if (res.status == 200) {
            this.authenticated = true;
            console.log('Authenticated');
          }
        });
    }
  }

  isAuthenticated() {
    return this.authenticated;
  }

  authenticate(username: String, password: String) {
    let authToken = btoa(`${username}:${password}`);

    return this.http.post('/api/auth/login', JSON.stringify({username:username,password:password}), {
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        })
      })
      .map((res : Response) => {
        if (res.status == 200) {
          let data = res.json();
          this.token = data.token;
          localStorage.setItem('token', data.token);
          sessionStorage.setItem('authToken', authToken);
          this.authenticated = true;
          console.log('Authenticated');
        }
        return res;
      });

  }

  logout() {
    /*
     * If we had a login api, we would have done something like this

    return this.http.get(this.config.serverUrl + '/auth/logout', {
      headers: new Headers({
        'x-security-token': this.token
      })
    })
    .map((res : any) => {
      this.token = undefined;
      localStorage.removeItem('token');
    });
     */

    this.token = undefined;
    this.authenticated = false;
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('token');

    return Observable.of(true);
  }

  getUser() {
    console.log('Get User');
    return this.http.get('/api/user', {
       headers: new Headers({
         'x-access-token': this.token
       })
     })
     .map((res : any) => {
       console.log(res);
       let data = res.json();
       localStorage.setItem('user', JSON.stringify(data));
       return data;
     });
  }

  getToken() {
    return this.token;
  }

}
