import mongoose = require('mongoose');

/* User */
export interface IUser extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  subjects: [
    {
      subject:any;
      role:string;
      tasks: [number];
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
      role:String,
      tasks: [Number]
    }
  ]
});

export const User = mongoose.model<IUser>('User', UserSchema);
