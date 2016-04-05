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
	tasks: Tasks
}

export interface Tasks {
  requirements: Requirement[],
  count: number;
}

export interface Requirement {
  start: number;
  end: number;
  required: number;
}
