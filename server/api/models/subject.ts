import mongoose = require("mongoose");
import {UserDocument} from "./user";
import {LocationDocument} from "./location";

/** Subject */
export interface SubjectDocument extends  mongoose.Document {
  code: string;
  name: string;
  broadcasts: Broadcast[];
  queue: Queue;
  tasks: Task[];
  requirements: Requirement[];

  locations: LocationDocument[];

  // Not stored
  users?: {
    firstname: string;
    lastname: string;
    role: string;
    tasks?: any[];

    _id?: string;
    __v?: number;
    user?: any;
    subject?: any;
  }[];
}

/** Tasks */
export interface Task {
  _id?: string;
  number: number;
  title: string;
}

/** Requirements */
export interface Requirement {
  _id?: string;
  from: number;
  to: number;
  required: number;
}

/** Broadcast */
export interface Broadcast {
  _id?: string;
  author: UserDocument;
  title: string;
  content: string;
  created: Date;
}

/** Queue */
export interface Queue {
  _id?: string;
  active: boolean;
  list: QueueGroup[];
}

/** QueueGroup */
export interface QueueGroup {
  _id?: string;
  users: UserDocument[];
  helper?: UserDocument;
  timeEntered: Date;
  comment: string;
  position: number; // in queue
  task: number;
  location?: Location;
}

/** Location */
export interface Location {
  _id?: string;
  name: string;
  table: string;
}


/** Schema */
let subjectSchema = new mongoose.Schema({
  code: {type: String, unique: true},
  name: String,

  broadcasts: [
    {
      author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
      title: String,
      content: String,
      created: Date
    }
  ],
  queue: {
    active: {type: Boolean, default: false},
    list: [
      {
        users: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        helper: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        timeEntered: Date,
        comment: String,
        position: Number,
        task: Number,
        location: {
          name: String,
          table: Number
        }
      }
    ]
  },
  tasks: [{
    number: Number,
    title: String
  }],
  requirements: [{
    from: Number,
    to: Number,
    required: Number
  }],
  locations: [{type: mongoose.Schema.Types.ObjectId, ref: "Location"}]
});

/** Model */
export const Subject = mongoose.model<SubjectDocument>("Subject", subjectSchema);
