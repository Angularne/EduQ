import express = require('express');
import mongoose = require('mongoose');
//mongoose.Promise = global.Promise as any;

var router = express.Router();

/** Authentication */
router.use(require('./routes/auth.js'));

/** User */
router.use('/user', require('./routes/user'));

/** Subject */
router.use('/subject', require('./routes/subject'));







module.exports = router;
