const express = require('express');
const router = express.Router();
const checker = require('../util/menu-checker');
const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');


router.get('/', (req, res) => {
  res.json({success: true, message: 'Welcome to the api.'});
});

router.get('/menus', (req, res) => {
  checker.getAllMenus(new Date(), (err, menus) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err
      });
    }
    return res.json({success: true, menus});
  });
});

router.post('/auth', (req, res) => {
  User.findOne({email: req.body.email}).select('email, password').exec().then(user => {
    if (!user){
      res.status(400).json({success: false, error: 'No user with that email address.'});
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err
        });
      }
      if (isMatch){
        return res.json({success: true});
      }
      return res.status(401).json({success: false, error: 'Incorrect Password'});
    });
  });
});

router.post('/register', [
  check('email').isEmail().withMessage('Email address is invalid.').trim(),
  check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters.')],
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({success: false, error: errors.mapped()});
  }
  let user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save().then(user => {
    console.log(user);
    res.json({success: true, user});
  }).catch(reason => {
    console.log(reason);
    res.status(500).json({success: false, error: reason});
  });

});

module.exports = router;
