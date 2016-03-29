import {User} from "./user";
import {Queue} from './queue';
import {Broadcast} from './broadcast';

export interface Subject {
  	code: string;
  	name: string;
 	  broadcasts: [Broadcast],
 	  queue: Queue,
  	tasks: {
    		requirements: [{
      			start: number;
        			end: number;
        			required: number;
  		}]
    }
}
