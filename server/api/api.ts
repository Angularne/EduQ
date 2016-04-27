import express = require('express');
import mongoose = require('mongoose');
//mongoose.Promise = global.Promise as any;

var router = express.Router();

/** Pupluc routes */
router.use(require('./routes/public'))

/** Authentication */
router.use(require('./routes/auth'));

/** User */
router.use('/user', require('./routes/user'));

/** Subject */
router.use('/subject', require('./routes/subject'));







module.exports = router;
