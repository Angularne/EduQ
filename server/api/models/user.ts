import mongoose = require('mongoose');

/* User */
export interface IUser extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  classOf?: string; // Ikke lagt til i Schema

  subjects: [
    {
      subject:any;
      role:string;
      tasks: number[];
    }
  ]
}

let UserSchema: mongoose.Schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {type:String, unique: true},
  password: {type:String, select:false},
  subjects: [
    {
      subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject'},
      role:{type: String, enum: ['Student', 'Assistent', 'Teacher']},
      tasks: [Number]
    }
  ]
});

export const User = mongoose.model<IUser>('User', UserSchema);

export function authenticateUser(username: string, password: string, cb: (err, user: IUser) => void) {
  User.findOne({email:username, password:password}).populate('subjects.subject', 'code name').lean().exec(cb);
}
