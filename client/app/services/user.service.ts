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


  getUser(id: string, select: string = null, populate: string = null) {
    let url = '/api/user/' + id + '?'
    + (select ? 'select=' + select + '&': '')
    + (populate ? 'populate=' + populate : '');

    return this.http.get(url + id, {headers: authHeaders()}).map((res)=>{
      if (res.status == 200) {
        return res.json();
      }
      else {
        return null;
      }
    });
  }

  getUserRole(code: string) {
    return new Promise<string>((resolve, reject) => {
      if (!this.user) {
        this.fetchUser();
      } else {
        var index = -1;
        for (var i = 0; i < this.user.subjects.length; i++) {
          if (this.user.subjects[i].code === code) index = i;
        }
        if (index != -1) {
          resolve(this.user.subjects[index].role);
        }
      }
    });
  }

  getAllUsers(q: any = null, select: string = null, populate: string = null) {
    let url = '/api/user?'
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

  saveUsers(users: User[]) {
    console.log(users);
    return this.http.post('/api/user/class', JSON.stringify({users: users}), {headers: authHeaders()}).map((res) => {

    });
  }
}
