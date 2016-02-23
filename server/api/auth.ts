import express = require('express');
var router = express.Router();


router.post('/login', (req, res) => {
    console.log(req.body);
    let data  = req.body;
    if (data) {
      if (data.username === 'test' && data.password === 'test') {
          res.json({token: 'token'});
      } else {
        res.status(403);
        res.end();
      }
    } else {
      res.status(401);
      res.end();
    }


});



module.exports = router;
