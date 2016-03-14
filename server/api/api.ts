import {User} from './models/user';
import express = require('express');

var router = express.Router();


// Authentication
router.use(require('./auth.js'));

/** User */
let user = require('./routes/user');
router.use('/user', user);

/** Subject */
let subject = require('./routes/subject');
router.use('/subject', subject);

/** Method Not Allowed */
router.get('/*', (req, res, next) => {
  res.status(405);
  res.end();
});


module.exports = router;
