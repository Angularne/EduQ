import express = require('express');
var router = express.Router();


router.get('/*', (req, res, next) => {
  next();
});

/* Lorem Ipsum */
router.get('/lorem', (req, res) => {
  res.send('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
});

router.get('/*', (req, res, next) => {
  res.status(404);
  res.end();
});





module.exports = router;
