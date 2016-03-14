import express = require('express');
import {Subject, ISubject} from '../models/subject';
import {Request, Response, NextFunction} from "express";

/** Router */
var router = express.Router();

/** GET: Get subject */
router.get('/:code', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;
  var user = req.authenticatedUser;

  // if (checkAccess(user, code, /teacher|student|assistent/i)) {

  Subject.findOne({code: code}).lean().exec((err, subj) => {
    if (!err) {
      res.json(subj);
    } else {
      res.json(err);
    }
  })
});


/** broadcast */
router.post('/:code/broadcast', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;

  if (checkAccess(req.authenticatedUser, code, /teacher|assistent/i)) {
    Subject.findOne({code:code}).exec((err, subj) => {
      if (!err) {
        // Handle res
        if (subj) {
          // Subject found
          subj.broadcasts.push({author: req.authenticatedUser._id, title:req.body.title, content:req.body.content, created: new Date()});
          subj.save((err) => {
            if (!err){
              res.send('success');
            } else {
              console.error('Error on save: ' + err.message)}
              res.status(409);
              res.json(err);
          });
        } else {
          // Subject not found
          res.status(404);
          res.send('Subject not found');
        }
      } else {
        // Handle error
        res.json(err);
      }
    });
  } else {
    // Access denied
    res.status(401);
    res.end();
  }
});

router.post('/:code/queue', (req: Request, res: Response, next: NextFunction) => {
  var code = req.params.code;
  var users = req.body.users;
  Subject.findOne({code: code}).exec((err, subj) => {
    if (!err && subj) {
        // Subject found

        // Check if users already in queue
        for (var queued of subj.queue.list) {
          for (var queuedUser of queued.users) {
            for (var newUser of users) {
              if (queuedUser === newUser) {}
            }
          }
        }


        subj.queue.list.push({users: users, timeEntered: new Date()});
        subj.save((serr) => {
          if (!serr) {
            // Success
            res.status(201);
            res.end();
          } else {
            // Save Error
            res.status(409);
            res.json(serr);
          }
        });
    } else {
      res.status(409);
      res.json(err || 'Subject not found');
    }
  });
});


function checkAccess(user, code: string, role: RegExp) {
  for (var sub of user.subjects) {
    if (sub.code === code && role.test(sub.role)) {
      return true;
    }
  }
  return false;
}


module.exports = router;
