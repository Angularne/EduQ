import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from "angular2/http";

export interface Subject {
  	code: string;
  	name: string;
 	  broadcasts: [{
      		author: User;
      		title: string;
      		content: string;
      		created: Date;
    	}],
 	  queue: {
    		active: Boolean;
    		list: [{
        			users: [User];
        			helper?: string;
        			timeEntered: Date;
      		}]
        },
  	tasks: {
    		requirements: [{
      			start: number;
        			end: number;
        			required: number;
  		}]
    }
}

export interface User {
  firstname: string;
  lastname: string;
	email: string;
	password: string;
  subjects: [
    		{
      		subject: any;
      		role:string;
      		tasks: [number];
    	}
  ];

}

@Injectable()
export class IUserService {
  user: User;
  http: Http;
  token: string;
  contructor(@Inject(Http) http: Http) {
    this.token = localStorage.getItem('token');
    //this.getUserInit();
  }
  getUserInit() {
    return this.http
    .get('/user', {
      headers: new Headers({
        'x-security-token': this.token
      })
    })
    .map((res : any) => {
      console.log(res);
      let data = res.json();
      this.user = data.user;
      localStorage.setItem('user', JSON.stringify(this.user));
    });
  }
  getUser() {
    return USER;
  }
  removeLocalUser() {
    this.user = undefined;
    localStorage.removeItem('user');
  }
}

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
