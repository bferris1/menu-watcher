let express = require('express');
let router = express.Router();
let User = require('../models/user');

router.get('/', (req, res) => {
  User.findById(req.user.id).then(user => {
    return res.json({success: true, user});
  }).catch(err => {
    return res.status(500).json({success: false, error: err});
  });
});

// todo: validation
router.post('/', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let pushoverKey = req.body.pushoverKey;
  if (!(email || password || pushoverKey)){
    return res.json({success: false, message: 'No changes made.'});
  } else {
    User.findById(req.user.id).then(user => {
      if (email) user.email = email;
      if (password) user.password = password;
      if (pushoverKey) user.pushoverKey = pushoverKey;
      if (pushoverKey === '') user.pushoverKey = undefined;
      return user.save();
    }).then(user => {
      user.password = '';
      return res.json({success: true, user});
    }).catch(err => {
      return res.status(500).json({success: false, error: err});
    });
  }
});


module.exports = router;