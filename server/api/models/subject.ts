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
  ]
  queue: {
    active: Boolean;
    list: [
      {
        _id?: string;
        users: string[];
        helper?: string;
        timeEntered: Date;
        room: string;
      }
    ]
  }
  tasks: {
    requirements: [
      {
        _id: string;
        start: number;
        end: number;
        required: number;
      }
    ];
    count: number;

  }
  students: string[];
  assistents: string[];
  teachers: string[];
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
        timeEntered: Date,
      //  room: {type: mongoose.Schema.Types.ObjectId, res: 'Location.rooms'}
      }
    ]
  },
  tasks: {
    requirements: [
      {
        start: Number,
        end: Number,
        required: Number
      }
    ],
    count: Number
  },
  students: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
  assistents: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
  teachers: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
