import mongoose = require('mongoose');
import {Subject, SubjectDocument, Task, Requirement, Broadcast} from './subject';

/* User */
export interface UserDocument extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  rights: string;
  classOf: string;

  realPassword?: string;

  // Not stored
  subjects?: {
    _id?: string;
    code: string;
    name: string;
    role: string;
    subjectTasks: Task[], // Tasks in subject
    requirements: Requirement[];
    tasks: any[];
    broadcasts?: Broadcast[];

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


export function getUser(id: string) {
  return new Promise<UserDocument>((resolve, reject) => {
    User.aggregate().match({
      _id:id
    }).limit(1)
    .append({
      $lookup: {
        from: 'usersubjects',        //<collection to join>,
        localField: '_id',          //<field from the input documents>,
        foreignField: 'user',      //<field from the documents of the "from" collection>,
        as: 'subjects'            //<output array field>
      }
    }).exec().then((users) => {

      let u = users[0];
      if (!u) {
        return reject({message: 'Brukernavn er ikke registrert'});
      }


      Subject.populate(users[0], {
        path: 'subjects.subject',
        select: 'code name tasks requirements broadcasts'
      }).then((user) => {
        // subjects populated

        User.populate(user, {
          path: 'subjects.tasks.approvedBy subjects.subject.broadcasts.author',
          select: 'firstname lastname'
        }).then((user2) => {


          for (var subject of user2.subjects) {
            // Remap fields
            subject._id = subject.subject._id;
            subject.code = subject.subject.code;
            subject.name = subject.subject.name;
            subject.broadcasts = subject.subject.broadcasts;

            if (subject.role == "Student") {
              subject.subjectTasks = subject.subject.tasks;
              subject.requirements = subject.subject.requirements;
            } else {
              delete subject.tasks;
            }

            delete subject.__v;
            delete subject.user;
            delete subject.subject;
          }
          // Send user
          resolve(user2);
        }, (err) => {
          reject(err);
          console.error(err);
        });
      }, (err) => {
        // ERROR
        reject(err);
        console.error(err);
      });

    }, (err) => {
      // ERROR
      reject(err);
      console.error(err);
    });
  });
}


export function authenticateUser(username: string, password: string) {
  return new Promise<UserDocument>((resolve, reject) => {
    User.aggregate().match({
      email:username
    }).limit(1)
    .append({
      $lookup: {
        from: 'usersubjects',        //<collection to join>,
        localField: '_id',          //<field from the input documents>,
        foreignField: 'user',      //<field from the documents of the "from" collection>,
        as: 'subjects'            //<output array field>
      }
    }).exec().then((users) => {

      let u = users[0];
      if (!u) {
        return reject({message: 'Brukernavn er ikke registrert'});
      }

      if (u.password !== password) {
        return reject({message: 'Feil passord eller brukernavn'})
      }


      Subject.populate(users[0], {
        path: 'subjects.subject',
        select: 'code name tasks requirements'
      }).then((user) => {
        // subjects populated

        User.populate(user, {
          path: 'subjects.tasks.approvedBy',
          select: 'firstname lastname'
        }).then((user2) => {



          for (var subject of user.subjects) {
            // Remap fields
            subject._id = subject.subject._id;
            subject.code = subject.subject.code;
            subject.name = subject.subject.name;

            if (subject.role == "Student") {
              subject.subjectTasks = subject.subject.tasks;
              subject.requirements = subject.subject.requirements;
            } else {
              delete subject.tasks;
            }

            delete subject.__v;
            delete subject.user;
            delete subject.subject;
          }
          // Send user
          resolve(user);
        }, (err) => {
          reject(err);
          console.error(err);
        });
      }, (err) => {
        // ERROR
        reject(err);
        console.error(err);
      });

    }, (err) => {
      // ERROR
      reject(err);
      console.error(err);
    });
  });
}
