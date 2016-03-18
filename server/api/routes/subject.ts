import express = require('express');
import {Subject, ISubject} from '../models/subject';
import {User, IUser} from '../models/user';
import {Request, Response, NextFunction} from "express";

/** Router */
var router = express.Router();

/**
 * Subject
 */

 /** GET: List all subjects */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  /** TODO */
  console.log('Not implemented');
});

/** GET: Get subject */
router.get('/:code', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher|student|assistent/i, 'code')) {
    denyAccess(res);
    return;
  }

  Subject.findOne({code: code}).populate('broadcasts.author queue.list.users', 'firstname lastname').lean().exec((err, subj) => {
    if (!err) {
      res.json(subj);
    } else {
      res.json(err);
    }
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
  subject.save((err, sub) => {
    if (!err) {
      res.status(201); // Created
      res.json(sub);
    } else {
      res.json(err);
    }
  });

});

/** PUT: Update Subject */
router.put('/:code', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher/i, 'code')) {
    denyAccess(res);
    return;
  }

  Subject.findOneAndUpdate({code:code}, req.body, (err, subj) => {
    if (!err) {
      res.json(subj);
    } else {
      res.status(409); // Conflict
      res.json(err);
    }
  });
});

/** POST: Add users to subject */
router.post('/:code/users', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher/i, 'code')) {
      denyAccess(res);
      return;
  }

  var i = 0;
  function finished() {
    i++;
    if (i >= 0) {
      res.end();
    }
  }
  i--;
  Subject.findOne({code:code}).select('_id').exec((err, subj) => {
    if (!err && subj) {
      // Subject exists
      if (req.body.student) {
        i--;
        User.update({_id:{$in: req.body.student}, 'subjects.subject': {$ne: subj._id}},
                    {$push:{subjects: {subject: subj._id, role: 'Student'}}}, (err, model) => {
          finished();
        });
      }
      if (req.body.assistent) {
        i--;
        User.update({_id:{$in: req.body.assistent}, 'subjects.subject': {$ne: subj._id}},
                    {$push:{subjects: {subject: subj._id, role: 'Assistent'}}}, (err, model) => {
          finished();
        });
      }
      if (req.body.teacher) {
        i--;
        User.update({_id:{$in: req.body.teacher}, 'subjects.subject': {$ne: subj._id}},
                    {$push:{subjects: {subject: subj._id, role: 'Teacher'}}}, (err, model) => {
          finished();
        });
      }
      finished();
    } else {
      res.json(err);
    }
  });
});

/** GET: List users in subject */
router.get('/:code/users', (req: Request, res: Response, next: NextFunction) => {
  var code: string = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    denyAccess(res);
    return;
  }

  Subject.findOne({code:code}).exec((err, subject) => {
    if (!err && subject) {
      User.find({'subjects.subject': subject._id}).lean().populate('subjects.subject', 'name code').exec((err, users) => {
        if (!err) {

          for (var user of users) {
            for (var subj of user.subjects) {
              if (subj.subject.code === code) {
                user.subjects = [subj];
                break;
              }
            }
          }

          res.json(users);
        } else {
          res.json(err);
        }
      });
    } else {
      res.json(err || 'Subject not found');
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
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    denyAccess(res);
    return;
  }

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

  Subject.findOneAndUpdate({code:code},{$push: {broadcasts: broadcast}},(err, subj) => {
    if (!err) {
      /** TODO? Trigger Socket update? */
      res.status(201);
      res.json(broadcast);
    } else {
      res.json(err);
    }
  });
});

/** PUT: Update broadcast */
router.post('/:code/broadcast/:bc_id', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    denyAccess(res);
    return;
  }

  delete req.body.created;

  Subject.findOneAndUpdate({code:code, 'broadcast._id': req.params.bc_id}, {broadcast:req.body}, (err, subj) => {
    if (!err) {
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
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    denyAccess(res);
    return;
  }

  Subject.update({code:code}, {$pull: {broadcasts:{_id: bc_id}}}, (err, model) => {
    if (!err) {
      res.json(model);
    } else {
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
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    denyAccess(res);
    return;
  }

  let activate: boolean = req.body.activate || false;
  Subject.findOneAndUpdate({code: code},{'queue.active': activate}).exec((err) => {
    if (!err) {
      res.end();
    } else {
      res.json(err);
    }
  });
});

/** POST: Add users to queue */
router.post('/:code/queue', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;
  var users_id = req.body.users;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent|student/i, 'code')) {
    denyAccess(res);
    return;
  }

  // Check parameters
  if (!users_id || users_id.length == 0) {
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
        var users: IUser[];
        User.find({_id: {$in:users_id}}).lean().select('firstname lastname subjects').exec((err, usersRes) => {
          if (!err && usersRes) {
            users = usersRes;
            for (var user of users) {
              if (!checkAccess(user, subj._id, /student/i)) {
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

             // Add group to queue and save
             subj.queue.list.push({_id:null, users: users_id, timeEntered: new Date()});
             subj.save((serr) => {
               if (!serr) {
                 // Success
                 res.status(201); // Created
                 res.end();
                 /** TODO Trigger socket event */
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

/** PUT: Add helper to queue */
router.put('/:code/queue/:qid', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;
  var qid = req.params.qid;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    denyAccess(res);
    return;
  }

  Subject.findOneAndUpdate(
    {code:code, 'queue.list._id': qid},
    {'queue.list.$.helper': req.authenticatedUser._id}
  ).exec((err, subj) => {
    if (!err) {
      res.end();
    } else {
      res.json(err);
    }
  });
});

/** DELETE: Remove group from queue */
router.delete('/:code/queue/:qid', (req: Request, res: Response, next: NextFunction) => {
  /** TODO Se på denne. finn en enklere måte? */

  var code : string = req.params.code;
  var qid : string = req.params.qid;



  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent|student/i, 'code')) {
    denyAccess(res);
    return;
  }

  Subject.findOne({code:code}).exec((err, subject) => {
    var force = checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code');
    var removed : boolean = false;
    if (!err) {
      for (var qi in subject.queue.list) {
        var q = subject.queue.list[qi];
        if (String(q._id) === qid) {
          // Group found
          if (force) {
            // Remove if assistent/teacher
            subject.queue.list.splice(+qi,1);
            removed = true;
          } else {
            for (var u of q.users) {
              if (String(u) === String(req.authenticatedUser._id)) {
                // User is in qroup
                subject.queue.list.splice(+qi,1);
                removed = true;
                break;
              }
            }
          }
          if (removed) {
            // Save
            subject.save((err) => {
              if (!err) {
                res.end()
              } else {
                res.json(err);
              }
              return;
            });
          } else {
            // Nothing to save
            res.end();
            return;
          }
        }
      }
    } else {
      res.json(err);
    }
  });
});

/** DELETE: Remove self from queue */
router.delete('/:code/queue', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent|student/i, 'code')) {
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
      if (affected.nModified > 0) {
        Subject.update(
          {code:code, 'queue.list.users.0': {$exists: false}},
          {$pull:{'queue.list':{$elemMatch:{'users.0': {$exists: false}}}}}
        ).exec((err) => {
          if (!err) {
            res.end();
          } else {
            res.json(err);
          }
        });
      } else { res.end(); }
    } else { res.json(err); }
  });
});


/**
 * Tasks
 */

/** POST: Add Requirement */
router.post('/:code/requirement', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher/i, 'code')) {
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

/** DELETE: Remove Requirement */
router.delete('/:code/requirement/:id', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check user privileges
  if (!checkAccess(req.authenticatedUser, code, /teacher/i, 'code')) {
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
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
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
  if (!checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
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




/**
 * Check if user has access to subject. Use path = 'code' to compare code, defaults to '_id'
 */
function checkAccess(user: IUser, subject, role: RegExp, path: string = '_id') {
  /** TODO Hvis superbruker, gi tilgang?*/
  switch (path) {
    case 'code':
    for (var sub of user.subjects) {
      if (sub.subject.code === subject && role.test(sub.role)) {
        return true;
      }
    }
    return false;

    default:
    for (var sub of user.subjects) {
      if (String(sub.subject) === String(subject) && role.test(sub.role)) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Denies access
 */
function denyAccess(res: Response, message: string = 'Access Denied') {
  res.status(403);
  res.json({message:message});
}



module.exports = router;
