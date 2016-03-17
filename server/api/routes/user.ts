import express = require('express');
import {User, IUser} from '../models/user';
import {Request, Response, NextFunction} from "express";

/** Router */
var router = express.Router();

/** GET: Get user */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.authenticatedUser);
  User.findById(req.authenticatedUser._id).populate('subjects.subject', 'code name').lean().exec((err, user) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  })
});

/** POST: Create new user */
router.post('/',(req: Request, res: Response, next: NextFunction) => {
  var user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    subjects: req.body.subjects || []
  });

  user.save((err) => {
    if (!err) {
      res.status(201);
      res.json(user);
    } else {
      console.error(`Error saving user: ${err.message}`);
      res.json(err);
    }
  })
});

/** PUT: Update user */
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  var id = req.params.id;
  /*
  User.update({_id: id}, req.body).exec((err, user) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
  */

  User.findOneAndUpdate({_id: id}, req.body, (err: any, user: IUser) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
});


module.exports = router;
