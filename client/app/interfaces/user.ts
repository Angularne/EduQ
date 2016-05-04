import {Subject, Task, Requirement, Broadcast} from "./subject";

export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
	email: string;
	password?: string;
  classOf: string;
  rights: string;

  subjects?: UserSubject[];
}


export interface UserSubject {
  code: string;
  name: string;
  role: string;
  subjectTasks: Task[], // Tasks in subject
  requirements: Requirement[],
  broadcasts: Broadcast[];
  tasks: any[];
}
