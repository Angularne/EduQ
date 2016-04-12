import {User, authenticateUser} from "../models/user";
import {Subject} from '../models/subject';
import {Request, Response, NextFunction} from 'express';
import express = require('express');
import jwt = require('jsonwebtoken');
import basicAuth = require('basic-auth');


var router = express.Router();

let secret = 'qwerty';
let authType = 'Basic Auth';

router.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {

  authenticateBasicAuth(req, res, next);

});

router.post('/auth/validate', (req: Request, res: Response, next: NextFunction) => {
  let data = basicAuth(req);
  if (data && data.name && data.pass) {
    authenticateUser(data.name, data.pass, (err, user) => {
      if (!err && user) {
        // Correct username and password
        res.end();
      } else {
        res.status(403);
        res.end();
      }
    });
  } else {
    unauthorized(res);
  }
});

router.post('/auth/token', (req: Request, res: Response, next: NextFunction) => {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, secret,
      (err, decoded) => {
        if (err) {
          res.status(403);
          res.json({ success: false, message: 'Failed to authenticate token.' });
          res.end();
        } else {
          res.json({});
        }
      }
    );
  } else {
    res.status(403);
    res.json({ success: false, message: 'Failed to authenticate token.' });
  }
});


  /** Basic Auth */
function authenticateBasicAuth(req: Request, res: Response, next: NextFunction) {
  let data = basicAuth(req);
  if (data && data.name && data.pass) {
    authenticateUser(data.name, data.pass, (err, user) => {
      if (!err && user) {

        req.authenticatedUser = user;
        res.sendStatus(200);

      } else {
        unauthorized(res);
      }
    });

  } else {
    unauthorized(res);
  }
}

/** JWT Authentication */
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  let data  = req.body;
  if (data) {
    authenticateUser(data.username, data.password, (err, user) => {
      if (!err) {
        // Handle res
        if (user) {
          // User found and correct password
          // login success
          var token = jwt.sign(user, secret, {expiresIn:'3600000'});

          res.json({
            success: true,
            token: token
          });
        } else {
          // Wrong username/password
          // login failed
          res.status(403);
          res.send('Feil brukernavn eller passord');
        }
      } else {
        // Handle error
        res.json(err);
      }
    });

  } else {
    res.status(401);
    res.end();
  }

}



  /** Using jwt to authenticate */
  /*
  router.use((req, res, next) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, secret,
        (err, decoded) => {
          if (err) {
            res.status(403);
            res.json({ success: false, message: 'Failed to authenticate token.' });
            res.end();
          } else {
            // if everything is good, save to request for use in other routes
            delete decoded.iat;
            delete decoded.exp;
            req.authenticatedUser = decoded;

            next();
          }
        }
      );
    } else {
      res.status(403);
      res.json({ success: false, message: 'Failed to authenticate token.' });
    }
  });

  /** Using basic auth */
  router.use((req: Request, res: Response, next: NextFunction) => {
    let data = basicAuth(req);
    if (data && data.name && data.pass) {
      authenticateUser(data.name, data.pass, (err, user) => {
        if (!err && user) {
          // Correct username and password
          req.authenticatedUser = user;
          next();
        } else {
          unauthorized(res);
        }
      });
    } else {
      unauthorized(res);
    }
  });



function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.sendStatus(401);
};

module.exports = router;
