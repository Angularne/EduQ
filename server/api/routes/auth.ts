import {User} from "./models/user";
import express = require('express');
import jwt = require('jsonwebtoken');

var router = express.Router();

let secret = 'qwerty';


router.post('/auth/login', (req, res) => {
    console.log(req.body);
    let data  = req.body;
    if (data) {
      User.findOne({email:data.username, password:data.password}).populate('subjects.subject', 'code name').lean().exec((err, user) => {
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

});

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


module.exports = router;
