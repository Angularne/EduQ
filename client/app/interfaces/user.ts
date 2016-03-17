import {Subject} from "./subject";

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
