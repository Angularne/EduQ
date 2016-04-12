import mongoose = require('mongoose');
import {SubjectDocument, Task, Requirement} from './subject';

/* User */
export interface UserDocument extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  rights: string;
  classOf: string;


  // Not stored
  subjects?: {
    _id?: string;
    code: string;
    name: string;
    role: string;
    subjectTasks: Task[], // Tasks in subject
    requirements: Requirement[];
    tasks: any[];

    __v?: number;
    user?: any;
    subject?: any;
  }[];
}

let UserSchema: mongoose.Schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {type:String, unique: true},
  password: {type:String, select:false},
  rights: {type: String, enum: ['Admin', 'Teacher', 'Student'], default: 'Student'},
  classOf: String
});

export const User = mongoose.model<UserDocument>('User', UserSchema);

export function authenticateUser(username: string, password: string, cb: (err, user: UserDocument) => void) {
  User.findOne({email:username, password:password}).populate('student assistent teacher', 'code name').lean().exec(cb);
}
