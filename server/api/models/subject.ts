import mongoose = require("mongoose");

/* Subject */
export interface ISubject extends mongoose.Document {
  code: string;
  name: string;
  broadcasts: [
    {
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
        users: [string];
        helper?: string;
        timeEntered: Date;
      }
    ]
  },
  tasks: {
    requirements: [
      {
        start: number;
        end: number;
        required: number;
      }
    ]
  }
}

let subjectSchema = new mongoose.Schema({
  code: String,
  name: String,
  broadcasts: [
    {
      author: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
      title: String,
      content: String
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
