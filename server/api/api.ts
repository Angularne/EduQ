import express = require('express');

var router = express.Router();

/** Authentication */
router.use(require('./routes/auth.js'));

/** User */
router.use('/user', require('./routes/user'));

/** Subject */
router.use('/subject', require('./routes/subject'));

/** Method Not Allowed */
router.get('/*', (req, res, next) => {
  res.status(405);
  res.end();
});

module.exports = router;
