// authentication.ts
import {Injectable, Inject} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from "angular2/http";

@Injectable()
export class Authentication {
  token: string;
  http: Http;
  constructor(@Inject(Http) http: Http) {
    this.token = localStorage.getItem('token');
  }

  login(username: String, password: String) {
    /*
     * If we had a login api, we would have done something like this
*/
    return this.http.post('/auth/login', JSON.stringify({
        username: username,
        password: password
      }), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .map((res : any) => {
        console.log(res);
        let data = res.json();
        this.token = data.token;
        localStorage.setItem('token', this.token);
      });
  /*
      for the purpose of this cookbook, we will juste simulate that


    if (username === 'test' && password === 'test') {
      this.token = 'token';
      localStorage.setItem('token', this.token);
      return Observable.of('token');
    }
*/
    //return Observable.throw('authentication failure');
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
    localStorage.removeItem('token');

    return Observable.of(true);
  }
}
