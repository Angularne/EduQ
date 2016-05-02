

import {User, authenticateUser, getUser} from "../models/user";
import {Subject} from '../models/subject';
import {Request, Response, NextFunction} from 'express';
import express = require('express');
import basicAuth = require('basic-auth');
import bcrypt = require('bcrypt');

export namespace Auth {

  export var router = express.Router();

  router.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {
    let data = basicAuth(req);
    if (data && data.name && data.pass) {
      User.findOne({email: data.name}).select('password').exec((err, user) => {
        if (!err) {
          if (user) {
            bcrypt.compare(data.pass, user.password, (err, val) => {
              if (!err) {
                if (val) {
                  // Success
                  res.end();

                } else {
                  // Wrong password
                  res.status(401).json({message: 'Feil passord eller brukernavn'});
                }
              } else {
                res.status(400).json(err);
              }
            });
          } else {
            // User not found
            res.status(401).json({message: 'Brukeren er ikke registrert'});
          }
        } else {
          res.status(400).json(err);
        }
      });
    } else {
      res.status(401).json({message: 'Username or password not provided'});
    }
  });


    /** Basic Auth */
  function authenticateBasicAuth(req: Request, res: Response, next: NextFunction) {
    let data = basicAuth(req);
    if (data && data.name && data.pass) {
      authenticateUser(data.name, data.pass).then((user) => {
        req.authenticatedUser = user;
        res.sendStatus(200);
      }).catch(err => {
        res.status(401).json(err);
      });

    } else {
      unauthorized(res);
    }
  }

  /** Using basic auth */
  router.use((req: Request, res: Response, next: NextFunction) => {
    let data = basicAuth(req);

    if (data && data.name && data.pass) {

      User.findOne({email: data.name}).select('password').exec((err, user) => {
        if (!err) {
          if (user) {
            bcrypt.compare(data.pass, user.password, (err, val) => {
              delete user.password;
              if (!err) {
                if (val) {
                  // Success
                  getUser(user._id).then(u => {
                    delete u.password;
                    req.authenticatedUser = u;
                    next();
                  }).catch(err => {
                    res.status(400).json(err);
                  })
                } else {
                  // Wrong password
                  res.status(401).json({message: 'Feil passord eller brukernavn'});
                }
              } else {
                res.status(400).json(err);
              }
            });
          } else {
            // User not found
            res.status(401).json({message: 'Brukeren er ikke registrert'});
          }
        } else {
          res.status(400).json(err);
        }
      });
    }
  });

  function unauthorized(res) {
    //res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  export function generateRandomPassword(){
    var password = '';
    let dictionary = 'abcdefghijklmnopqrstvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < 8; i++) {
      let random = Math.floor(Math.random() * dictionary.length);
      password += dictionary.charAt(random);
    }
    return password;
  }
}
//module.exports = router;
