import mongoose = require("mongoose");

/* Subject */
export interface ISubject extends mongoose.Document {
  code: string;
  name: string;
  broadcasts: [
    {
      _id: string;
      author: string;
      title: string;
      content: string;
      created: Date;
    }
  ],
  queue: {
    active: Boolean;
    list: [
      {
        _id: string;
        users: [string];
        helper?: string;
        timeEntered: Date;
      }
    ]
  },
  tasks: {
    requirements: [
      {
        _id: string;
        start: number;
        end: number;
        required: number;
      }
    ]
  }
}

let subjectSchema = new mongoose.Schema({
  code: {type:String, unique: true},
  name: String,
  broadcasts: [
    {
      author: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
      title: String,
      content: String,
      created: Date
    }
  ],
  queue: {
    active: {type:Boolean, default: false},
    list: [
      {
        users: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
        helper: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
        timeEntered: Date
      }
    ]
  },
  tasks: {
    requirements: [
      {
        start: Number,
        end: Number,
        required: Number,
      }
    ]
  }
});

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
