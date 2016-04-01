import {User} from "./user";
import {Queue} from './queue';
import {Broadcast} from './broadcast';

export interface Subject {
  _id?: string;
  	code: string;
  	name: string;
    students: User[];
 	  broadcasts: Broadcast[],
 	  queue: Queue,
  	tasks: {
    		requirements: {
      			start: number;
        			end: number;
        			required: number;
  		}[],
      count: number;
    }
}
