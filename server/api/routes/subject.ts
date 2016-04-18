import express = require('express');
import {Subject, SubjectDocument, Broadcast, Task, Queue, QueueGroup, Requirement, Location} from '../models/subject';
import {User, UserDocument} from '../models/user';
import {Request, Response, NextFunction} from "express";
import {QueueSocket} from '../socket';
import {UserSubject} from '../models/user.subject';




/** Router */
var router = express.Router();

/**
 * Subject
 */

 /** GET: List all subjects */
router.get('/', (req: Request, res: Response, next: NextFunction) => {

  // Check user privileges
  if (!/Admin|Teacher/i.test(req.authenticatedUser.rights)) {
    denyAccess(res);
    return;
  }

  let cond = JSON.parse(req.query.q || '{}');
  let select: string = (req.query.select || '').split(',').join(' ');;
  var populate = (req.query.populate || '').split(',').join(' ').split(';');
  let pop = populate[0];
  let popselect = populate[1];


  Subject.find(cond).select('code name').lean().exec((err, user) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
});

/** GET: Get subject */
router.get('/:code', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;


  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code)) {
    denyAccess(res);
    return;
  }

  // Show tasks if admin, teacher or assistent
  let showTasks = true;

  Subject.aggregate().match({
    code: code
  }).append({
    $lookup: {
      from: 'usersubjects',        //<collection to join>,
      localField: '_id',          //<field from the input documents>,
      foreignField: 'subject',   //<field from the documents of the "from" collection>,
      as: 'users'               //<output array field>
    }
  }).exec().then((subj) => {
    if (subj.length) {
      User.populate(subj[0], {
        path: 'users.user broadcasts.author queue.list.helper queue.list.users',
        select: 'firstname lastname'
      }).then((subject) => {
        // users populated
        for (var user of subject.users) {
          // Remap fields
          user.firstname = user.user.firstname;
          user.lastname = user.user.lastname;
          user._id = user.user._id;

          // remove unnecessary fields
          if (user.role != 'Student' || !showTasks) {
            delete user.tasks;
          }
          delete user.__v;
          delete user.user;
          delete user.subject;
        }
        // Send subject
        res.json(subject);
      }, (err) => {
        res.json(err);
      });
    }
  },(err) => {
    // ERROR
    res.json(err);
  });

});

/** POST: Create new subject */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  /** TODO Kun superbruker kan lage nye emner? */

  // Check body
  if (!req.body.code || !req.body.name) {
    res.status(409); // Conflict
    res.json('Code or name not set');
    return;
  }

  var subject = new Subject(req.body);
  subject.save((err) => {
    if (!err) {
      res.status(201); // Created
      res.json(subject);


      var users: {
        user: string,
        subject: string,
        role: string
      }[] = req.body.users;

      for (var u of users) {
        u.subject = subject._id;
      }

      UserSubject.create(users).then((res)=> {});
      QueueSocket.createNamespace(subject.code);
    } else {
      res.json(err);
    }
  });

});

/** PUT: Update Subject */
router.put('/:code', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher/i)) {
    denyAccess(res);
    return;
  }

  Subject.findOneAndUpdate({code:code}, req.body, {new:true}, (err, subject) => {
    if (!err || subject) {

       var user_id: string[] = [];

       for (var user of req.body.users || []) {
         user.user = user._id;
         user.subject = subject._id;

         user_id.push(user._id);

         UserSubject.findOneAndUpdate({
           user: user.user,
           subject: user.subject
         }, {
           role: user.role
         }, {
           upsert: true
         }).exec().then((u) => {
         }, (err) => {
           console.log(err);
         });
       }


       UserSubject.remove({
         subject: subject._id,
         user: {$nin: user_id}
       }).exec().then((usr) => {
       }, (err) => {
         console.log(err);
       });
      res.json(subject);
    } else {
      res.status(409); // Conflict
      res.json(err);
    }
  });
});

/** POST: Add users to subject */ // Ikke i bruk
router.post('/:code/users', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher/i)) {
      denyAccess(res);
      return;
  }

  // Check data
  var students = req.body.students || [];
  var assistents = req.body.assistents || [];
  var teachers = req.body.teachers || [];

  var i = 0;
  function finished() {
    i++;
    if (i >= 0) {
      res.end();
    }
  }
  i--;
  Subject.findOneAndUpdate({code:code},
    {$addToSet: {students: {$each: students},assistents: {$each: assistents},teachers: {$each: teachers}}}).select('_id').exec((err, subj) => {
    if (!err && subj) {
      // Subject exists
      if (students.length) {
        i--;
        User.update({_id:{$in: students}, 'subjects.subject': {$ne: subj._id}},
                    {$push:{subjects: {subject: subj._id, role: 'Student'}}}, {multi: true}, (err, model) => {
          finished();
        });
      }
      if (assistents.length) {
        i--;
        User.update({_id:{$in: assistents}, 'subjects.subject': {$ne: subj._id}},
                    {$push:{subjects: {subject: subj._id, role: 'Assistent'}}}, {multi: true}, (err, model) => {
                      finished();
        });
      }
      if (teachers.length) {
        i--;
        User.update({_id:{$in: teachers}, 'subjects.subject': {$ne: subj._id}},
                    {$push:{subjects: {subject: subj._id, role: 'Teacher'}}}, {multi: true}, (err, model) => {
                      finished();
        });
      }
      finished();
    } else {
      res.json(err);
    }
  });
});

/** DELETE: Remove users from subject */ // Ikke i bruk
router.delete('/:code/users', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher/i)) {
      denyAccess(res);
      return;
  }

  // Check data
  var students = req.body.students || [];
  var assistents = req.body.assistents || [];
  var teachers = req.body.teachers || [];

  var i = 0;
  function finished() {
    i++;
    if (i >= 0) {
      res.end();
    }
  }
  i--;
  Subject.findOneAndUpdate({code:code},
    {$pullAll: {students: students,assistents: assistents,teachers: teachers}}).select('_id').exec((err, subj) => {
    if (!err && subj) {
      // Subject exists
      if (students.length) {
        i--;
        User.update({_id:{$in: students}, 'subjects.subject': {$in: subj._id}},
                    {$pull:{subjects:{$elemMatch: {subject: subj._id, role: 'Student'}}}}, {multi: true}, (err, model) => {
          finished();
        });
      }
      if (assistents.length) {
        i--;
        User.update({_id:{$in: assistents}, 'subjects.subject': {$in: subj._id}},
                    {$pull:{subjects: {subject: subj._id, role: 'Assistent'}}}, {multi: true}, (err, model) => {
                      finished();
        });
      }
      if (teachers.length) {
        i--;
        User.update({_id:{$in: teachers}, 'subjects.subject': {$in: subj._id}},
                    {$pull:{subjects: {subject: subj._id, role: 'Teacher'}}}, {multi: true}, (err, model) => {
                      finished();
        });
      }
      finished();
    } else {
      res.json(err);
    }
  });
});




/**
 * Broadcast
 */

/** POST: Create broadcast */
router.post('/:code/broadcast', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    denyAccess(res);
    return;
  }

  console.log(req.body);
  // Check body
  if (!(req.body.title && req.body.content)) {
    res.status(409); // Conflict
    res.json('title or content not set');
    return;
  }

  let broadcast = {
    author: req.authenticatedUser._id,
    title:req.body.title,
    content:req.body.content,
    created: new Date()
  };

  Subject.findOneAndUpdate({code:code},{$push: {broadcasts: broadcast}}).exec((err, subj) => {
    if (!err) {

      QueueSocket.broadcast(code);
      res.status(201);
      res.end();
    } else {
      res.json(err);
    }
  });
});

/** PUT: Update broadcast */
router.post('/:code/broadcast/:bc_id', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    denyAccess(res);
    return;
  }

  delete req.body.created;

  Subject.findOneAndUpdate({code:code, 'broadcast._id': req.params.bc_id}, {broadcast:req.body}, (err, subj) => {
    if (!err) {
      QueueSocket.broadcast(code);
      res.end();
    } else {
      res.status(409); // Conflict
      res.json(err);
    }
  });
});

/** DELETE: Delete broadcast */
router.delete('/:code/broadcast/:bc_id', (req: Request, res: Response, next: NextFunction) => {
  let code = req.params.code;
  let bc_id = req.params.bc_id;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    denyAccess(res);
    return;
  }

  Subject.update({code:code}, {$pull: {broadcasts:{_id: bc_id}}}, (err, model) => {
    if (!err) {
      QueueSocket.broadcast(code);
      res.end();
    } else {
      res.status(409);
      res.json(err);
    }
  });
});


/**
 * Queue
 */

/** PUT: Start and stop queue */
router.put('/:code/queue/', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    denyAccess(res);
    return;
  }

  let activate: boolean = req.body.activate || false;
  Subject.findOneAndUpdate({code: code},{'queue.active': activate}).exec((err, subj) => {
    if (!err) {
      res.end();
      QueueSocket.queue(code);
    } else {
      res.json(err);
    }
  });
});

/** POST: Add users to queue */
router.post('/:code/queue', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;
  var users_id = req.body.users || [];

  users_id.push(req.authenticatedUser._id);

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code)) {
    denyAccess(res);
    return;
  }

  // Check parameters
  if (!users_id) {
    res.json('Users not set');
    return;
  }

  Subject.findOne({code: code}).exec((err, subj) => {
    if (!err && subj) {
        // Subject found
        if (!subj.queue.active) {
          res.status(409);
          res.json('Queue not active');
          return;
        }
        // Find users and check access

        var users: UserDocument[];
        User.find({_id: {$in:users_id}}).lean().select('firstname lastname subjects').exec((err, usersRes) => {
          if (!err && usersRes) {
            users = usersRes;
            for (var user of users) {
              if (!hasAccess(req.authenticatedUser, code, /student/i)) {
                // Some users do not have access to subject
                res.status(409); // Conflict
                res.json('Some users do not have access to subject');
                return;
              }
             }
             // Check if users already in queue
             for (var queued of subj.queue.list) {
               for (var queuedUser of queued.users) {
                 for (var user of users) {
                   if (String(queuedUser) === String(user._id)) {
                     // Some users already in queue
                     res.status(409);
                     res.json(`${user.firstname} ${user.lastname} already in queue`);
                     return;
                   }
                 }
               }
             }
             // TODO: get room from user

             // Add group to queue and save

             let q: QueueGroup = {
               users: users_id,
               helper: null,
               timeEntered: new Date(),
               comment: 'string',
               position: 1, // in queue
               location: null
             }



             subj.queue.list.push(q);

             subj.save((serr) => {
               if (!serr) {
                 // Success
                 res.status(201); // Created
                 res.end();

                 QueueSocket.queue(code);
               } else {
                 // Save Error
                 res.status(409); // Conflict
                 res.json(serr);
               }
             });
          } else {
            res.json(err);
          }
        });
    } else {
      res.status(409); // Conflict
      res.json(err || 'Subject not found');
    }
  });
});

/** PUT: Update queue item
router.put('/:code/queue/:id', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;
  var id: string = req.params.id;

  var updates = req.body;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code)) {
    denyAccess(res);
    return;
  }
});
*/

/** PUT: Add helper to queue */
router.put('/:code/queue/:qid', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;
  var qid = req.params.qid;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    denyAccess(res);
    return;
  }



  Subject.findOneAndUpdate(
    {code:code, 'queue.list._id': qid},
    {'queue.list.$.helper': req.authenticatedUser._id}
  ).exec((err, subj) => {
    if (!err) {
      QueueSocket.queue(code);
      res.end();
    } else {
      res.json(err);
    }
  });
});

/** DELETE: Remove group from queue */
router.delete('/:code/queue/:id', (req: Request, res: Response, next: NextFunction) => {
  var code : string = req.params.code;
  var id : string = req.params.id;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code)) {
    denyAccess(res);
    return;
  }

  // Validate if user can remove grup
  var force = hasAccess(req.authenticatedUser, code, /teacher|assistent/i);
  var cond: any = {
    code: code,
    'queue.list': {
      $elemMatch: {
          _id: id,
          users: req.authenticatedUser._id
      }
    }
  };
  if (force) {
    delete cond['queue.list'].$elemMatch.users;
  }

  // Execute
  Subject.findOneAndUpdate(cond, {$pull: {'queue.list': {_id:id}}}).exec((err, sub) => {
      if (!err && sub) {
        QueueSocket.queue(code);
        res.end();
      } else {
        res.status(409);
        res.json(err || {});
      }
  });
});

/** DELETE: Remove self from queue */
router.delete('/:code/queue', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code)) {
    denyAccess(res);
    return;
  }

  // Remove self
  Subject.update(
    {code:code, 'queue.list.users': req.authenticatedUser._id},
    {$pull:{'queue.list.$.users':req.authenticatedUser._id}}
  ).exec((err, affected: any) => {
    if (!err) {
      // Check number of users left in group
      // Remove if no users left
      console.log(affected);
      if (affected.nModified > 0) {
        Subject.update(
          {code:code, 'queue.list.users': []},
          {$pull:{'queue.list':{'users': []}}}
        ).exec((err) => {
          if (!err) {
            QueueSocket.queue(code);
            res.end();

          } else {
            res.json(err);
          }
        });
      } else {
        QueueSocket.queue(code);
        res.end(); }
    } else { res.json(err); }
  });
});


/**
 * Tasks
 */

/** POST: Add Requirement */ // ikke i bruk
router.post('/:code/requirement', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher/)) {
    denyAccess(res);
    return;
  }

  var requirement = req.body.requirement;
  if (requirement && requirement.start && requirement.end && requirement.required) {
    Subject.findOneAndUpdate({code:code}, {$push: {'tasks.requirements':requirement}}).exec((err) => {
      if (!err) {
        res.end();
      } else {
        res.json(err);
      }
    });
  } else {
    // Wrong data
    res.sendStatus(409);
  }
});

/** DELETE: Remove Requirement */ // ikke i bruk
router.delete('/:code/requirement/:id', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher/i)) {
    denyAccess(res);
    return;
  }

  Subject.findOneAndUpdate({code:code},{$pull:{'tasks.requirements':{_id:req.params.id}}}).exec((err) => {
    if (!err) {
      res.end();
    } else {
      res.json(err);
    }
  });
});

/** POST: Add tasks to users  */
router.post('/:code/task', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    denyAccess(res);
    return;
  }

  var usersID = req.body.users;
  var tasks: number[] = req.body.tasks;

  if (usersID instanceof Array && usersID.length > 0 && tasks instanceof Array && tasks.length > 0) {
    Subject.findOne({code:code}).select('_id').lean().exec((err, subject) => {
      if (!err && subject) {
        User.update(
          {_id:{$in: usersID}, subjects:{$elemMatch:{subject:subject._id, role:'Student'}}},
          {$addToSet: {'subjects.$.tasks':{$each:tasks}}}
        ).exec((err, users) => {
          if (!err && users) {
            res.json(users);
          } else {
            res.json(err);
          }
        });
      } else {
        res.json(err);
      }
    });
  } else {
    // Wrong data
    res.sendStatus(409);
  }
});

/** DELETE: Remove tasks from users */
router.delete('/:code/task', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;

  // Check user privileges
  if (!hasAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    denyAccess(res);
    return;
  }

  var usersID = req.body.users;
  var tasks: number[] = req.body.tasks;

  if (usersID instanceof Array && usersID.length > 0 && tasks instanceof Array && tasks.length > 0) {
    Subject.findOne({code:code}).select('_id').lean().exec((err, subject) => {
      if (!err && subject) {
        User.update(
          {_id:{$in: usersID}, subjects:{$elemMatch:{subject:subject._id, role:'student'}}},
          {$pullAll: {'subjects.$.tasks':tasks}}
        ).exec((err, users) => {
          if (!err && users) {
            res.json(users);
          } else {
            res.json(err);
          }
        });
      } else {
        res.json(err);
      }
    });
  } else {
    // Wrong data
    res.sendStatus(409);
  }
});




function hasAccess(user: UserDocument, code: string, role: RegExp = /.*/) {
  if (user.rights == 'Admin') {
    return true;
  }

  for (let sub of user.subjects) {
    if (sub.code == code) return role.test(sub.role);
  }
  return false;
}




/**
 * Denies access
 */
function denyAccess(res: Response, message: string = 'Access Denied') {
  res.status(403);
  res.json({message:message});
}



module.exports = router;
