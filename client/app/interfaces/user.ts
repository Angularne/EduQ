import {Subject} from "./subject";

export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
	email: string;
	password?: string;
  subjects: UserSubjects[]
}

interface UserSubjects {
  subject: Subject;
  role:string;
  tasks: [number];
}
