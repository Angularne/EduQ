import express = require('express');
import {User, IUser} from '../models/user';
import {Request, Response, NextFunction} from "express";

/** Router */
var router = express.Router();

/** GET: Get authenticated user */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.authenticatedUser._id).populate('subjects.subject', 'code name').lean().exec((err, user) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
});

/** GET: Get user */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  /** TODO Hvem kan hente brukerinfo */
  let id: string = req.params.id;
  User.findById(id).populate('subjects.subject', 'code name').lean().exec((err, user) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
});

/** POST: Create new user */
router.post('/',(req: Request, res: Response, next: NextFunction) => {
  /** TODO Kun superbruker kan lage brukerkontoer? */
  /** TODO Valider data */

  var user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    subjects: []
  });

  user.save((err) => {
    if (!err) {
      res.status(201);
      res.json(user);
    } else {
      res.json(err);
    }
  })
});



/** PUT: Update user */
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  /** TODO Superbruker kan endre brukere */
  /** TODO Valider data */
  var id = req.params.id;
  if (String(req.authenticatedUser._id) === id) {

    // Remove subjects from update
    var user = req.params.body;
    delete user.subjects;

    User.findOneAndUpdate({_id: id}, user, (err: any, user: IUser) => {
      if (!err) {
        res.json(user);
      } else {
        res.json(err);
      }
    });
  } else {
    denyAccess(res);
  }
});

/** DELETE: Delete user */
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  /** TODO Kun Superbruker kan slette brukere? */
  User.remove({_id:req.params.id}, (err) => {
    if (!err) {
      res.end();
    } else {
      res.json(err);
    }
  });
});


/**
 * Denies access
 */
function denyAccess(res: Response, message: string = 'Access Denied') {
  res.status(403);
  res.json({message:message});
}

module.exports = router;
