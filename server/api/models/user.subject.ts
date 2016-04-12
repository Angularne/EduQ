import mongoose = require("mongoose");
import {UserDocument} from './user';
import {SubjectDocument} from './subject';



export interface UserSubjectDocument extends mongoose.Document {
  user: UserDocument;
  subject: SubjectDocument;
  role: string;
  tasks: StudentTask[];
}

interface StudentTask {
  number: number;
  date: Date;
  approvedBy: UserDocument;
}

let UserSubjectSchema: mongoose.Schema = new mongoose.Schema({
  user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
  subject: {type:mongoose.Schema.Types.ObjectId, ref: 'Subject'},
  role: String,
  tasks: [{
    number: Number,
    date: Date,
    approvedBy: {type:mongoose.Schema.Types.ObjectId, ref: 'UserS'}
  }]
});

export const UserSubject = mongoose.model<UserSubjectDocument>('UserSubject', UserSubjectSchema);
