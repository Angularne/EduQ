import express = require('express');
import {User, UserDocument} from '../models/user';
import {Subject} from '../models/subject';
import {Request, Response, NextFunction} from "express";

/** Router */
var router = express.Router();

/** GET: Get authenticated user */
router.get('/me', (req: Request, res: Response, next: NextFunction) => {

  res.json(req.authenticatedUser);

});

/** GET: Get all user */
router.get('/', (req: Request, res: Response, next: NextFunction) => {

  // Check user privileges
  if (!/Admin|Teacher/i.test(req.authenticatedUser.rights)) {
    denyAccess(res);
    return;
  }

  let cond: any = JSON.parse(req.query.q || '{}');
  let select: string = (req.query.select || '').split(',').join(' ');;
  var populate: string = (req.query.populate || '').split(',').join(' ').split(';');
  let pop: string = populate[0];
  let popselect: string = populate[1];


  User.find(cond).select(select).populate(pop, popselect).lean().exec((err, user) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
});

/** GET: Get user */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  let id: string = req.params.id;

  // Check user privileges
  if (!/Admin|Teacher/i.test(req.authenticatedUser.rights) && String(req.authenticatedUser._id) != id) {
    denyAccess(res);
    return;
  }

  let cond: any = JSON.parse(req.query.q || '{}');
  let select: string = (req.query.select || '').split(',').join(' ');;
  var populate: string = (req.query.populate || '').split(',').join(' ').split(';');
  let pop: string = populate[0];
  let popselect: string = populate[1];


  User.findById(id).populate(pop, popselect).lean().exec((err, user) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });
});

/** POST: Create new user */
router.post('/',(req: Request, res: Response, next: NextFunction) => {
  /** TODO Valider data */

  // Check user privileges
  if (!/Admin/i.test(req.authenticatedUser.rights)) {
    denyAccess(res);
    return;
  }

  req.body.subjects = [];
  var user = new User(req.body);

  user.save((err) => {
    if (!err) {
      res.status(201);
      res.json(user);
    } else {
      res.json(err);
    }
  })
});

/** POST: Create list of users */
router.post('/class', (req: Request, res: Response, next: NextFunction) => {

  // Check user privileges
  if (!/Admin/i.test(req.authenticatedUser.rights)) {
    denyAccess(res);
    return;
  }

  let users = req.body.users;


  for (var user of users) {
    user.realPassword = randomPassword();
    user.password = user.realPassword; /** TODO HASH */
  }


  User.create(users).then((us: any) => {
    console.log(users);
    for (let u of users) {
      // Send mail with password
    }

    res.end();
  }, (err) => {
    console.log(err);
    res.status(409).json(err);
  });
});

/** PUT: Update user */
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  /** TODO Valider data */
  /** Bør gjøres noe med */
  var id = req.params.id;

  // Check user privileges
  if (!/Admin|Teacher/i.test(req.authenticatedUser.rights)) {
    denyAccess(res);
    return;
  }

  // Remove subjects from update
  var user = req.body;
  delete user.subjects;
  delete user.__v;

  var cond: any = {
    _id: id
  };

  if (user.password) {
    cond.password = user.oldPassword;

    delete user.oldPassword;
  }

  User.findOneAndUpdate(cond, user, (err: any, user: UserDocument) => {
    if (!err) {
      res.json(user);
    } else {
      res.json(err);
    }
  });

});

/** DELETE: Delete user */
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  // Check user privileges
  if (!/Admin/i.test(req.authenticatedUser.rights)) {
    denyAccess(res);
    return;
  }

  User.remove({_id:req.params.id}, (err) => {
    if (!err) {
      res.end();
    } else {
      res.json(err);
    }
  });
});

/** TODO */
function randomPassword() {
  console.log('TODO: generate random password and hash');
  return 'password';
}



/**
 * Denies access
 */
function denyAccess(res: Response, message: string = 'Access Denied') {
  res.status(403);
  res.json({message:message});
}

module.exports = router;
