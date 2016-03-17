import {User} from "./user";

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
