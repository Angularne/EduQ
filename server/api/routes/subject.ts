import express = require('express');
import {Subject, ISubject} from '../models/subject';
import {User, IUser} from '../models/user';
import {Request, Response, NextFunction} from "express";

/** Router */
var router = express.Router();

/**
 * Subject
 */

/** GET: Get subject */
router.get('/:code', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;
  var user = req.authenticatedUser;

  if (checkAccess(user, code, /teacher|student|assistent/i, 'code')) {
    Subject.findOne({code: code}).populate('broadcasts.author queue.list.users', 'firstname lastname').lean().exec((err, subj) => {
      if (!err) {
        res.json(subj);
      } else {
        res.json(err);
      }
    });
  } else {
    denyAccess(res, 'User does not have access to subject')
  }
});

/** POST: Create new subject */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
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
  })


});


/**
 * Broadcast
 */

/** POST: Create broadcast */
router.post('/:code/broadcast', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  // Check body
  if (!(req.body.title && req.body.content)) {
    res.status(409); // Conflict
    res.json('title or content not set');
    return;
  }

  if (checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    let broadcast = {
      author: req.authenticatedUser._id,
      title:req.body.title,
      content:req.body.content,
      created: new Date()
    };

    Subject.findOneAndUpdate({code:code},
      {$push: {broadcasts: broadcast}},(err, subj) => {
        if (!err) {
          /** TODO? Trigger Socket update? */
          res.status(201);
          res.json(broadcast);
        } else {
          res.json(err);
        }
      });
  } else {
    denyAccess(res);
  }
});

/** PUT: Update broadcast */
router.post('/:code/broadcast/:bc_id', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  if (checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    delete req.body.created;
    Subject.findOneAndUpdate({code:code, 'broadcast._id': req.params.bc_id}, {broadcast:req.body}, (err, subj) => {
      if (!err) {
        res.end();
      } else {
        res.status(409); // Conflict
        res.json(err);
      }
    });
  } else {
    denyAccess(res);
  }
});

/** DELETE: Delete broadcast */
router.delete('/:code/broadcast/:bc_id', (req: Request, res: Response, next: NextFunction) => {
  let code = req.params.code;
  let bc_id = req.params.bc_id;

  if (checkAccess(req.authenticatedUser, code, /teacher|assistent/i, 'code')) {
    Subject.update({code:code}, {$pull: {broadcasts:{_id: bc_id}}}, (err, model) => {
      if (!err) {
        res.json(model);
      } else {
        res.json(err);
      }
    });
  } else {
    denyAccess(res);
  }
});


/**
 * Queue
 */

/** Add users to queue */
router.post('/:code/queue', (req: Request, res: Response, next: NextFunction) => {

  var code = req.params.code;
  var users_id = req.body.users;

  // Check parameters
  if (!users_id || users_id.length == 0) {
    res.json('Users not set');
    return;
  }

  Subject.findOne({code: code}).exec((err, subj) => {
    if (!err && subj) {
        // Subject found
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
             subj.queue.list.push({users: users_id, timeEntered: new Date()});
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

/**
 * Tasks
 */

/**
 * Check if user has access to subject. Use id = 'code' to compare code
 */
function checkAccess(user: IUser, subject, role: RegExp, id: string = 'id') {
  switch (id) {
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
