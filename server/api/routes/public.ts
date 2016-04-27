import express = require('express');
import {User, UserDocument} from '../models/user';
import {Subject} from '../models/subject';
import {Request, Response, NextFunction} from "express";
import {Password} from '../password';
import {Mail} from '../mail';

var router = express.Router();

/** POST: Forgot password */
router.post('/forgotpassword', (req: Request, res: Response, next: NextFunction) => {
  let email = req.body.email;

  console.log(email);

  if (email) {

    User.findOne({email: email}).select('password').exec((err, u) => {

      if (err) {
        return res.status(400).json(err);
      }

      if (u) {
        let password = Password.random();

        u.password = password;

        u.save((err) => {
          if (!err) {

            Mail.forgotpassword(email, password);

            res.json({message: 'Nytt passord blir sendt på epost'});
          } else {
            res.status(400).json(err);
          }
        });
      } else {
        res.status(404).json({message: 'Bruker ikke funnet'});
      }
    });
  } else {
    res.status(400).json({message: 'Ingen epost satt'});
  }

});

module.exports = router;
