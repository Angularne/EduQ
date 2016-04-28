import express = require('express');
import mongoose = require('mongoose');
import {Auth} from './routes/auth';
//mongoose.Promise = global.Promise as any;

var router = express.Router();

/** Pupluc routes */
router.use(require('./routes/public'))

/** Authentication */
router.use(Auth.router);

/** User */
router.use('/user', require('./routes/user'));

/** Subject */
router.use('/subject', require('./routes/subject'));







module.exports = router;
