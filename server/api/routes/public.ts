import express = require('express');
import {User, UserDocument} from '../models/user';
import {Subject} from '../models/subject';
import {Request, Response, NextFunction} from "express";



var router = express.Router();

/** POST: Forgot password */
router.post('/forgotpassword', (req: Request, res: Response, next: NextFunction) => {
  let email = req.body.email;

  User.findOne({email: email}).select('password').exec().then((u) => {
    /**   TODO: Lag nytt passord og send på epost */
    res.json({message: 'Ditt password er: \'' + u.password + '\''});
  }, (err) => {
    res.status(400).json(err);
  });
});

module.exports = router;
