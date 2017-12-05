const express = require('express');
const router = express.Router();
const checker = require('../util/menu-checker');
const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('../config');


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
        jwt.sign({
          email: user.email,
          id: user._id
        }, config.get('jwt.secret'), function (err, token) {
          if (err) return res.status(500).json({success: false});
          return res.json({success: true, token: token});
        });
      } else {
        return res.status(401).json({success: false, error: 'Incorrect Password'});
      }
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

router.use((req, res, next) => {
  let token = req.body.token || req.params.token || req.headers['x-access-token'];
  if (token){
    jwt.verify(token, config.get('jwt.secret'), function (err, decoded){
      if (err){
        return res.status(403).send({success: false, message: 'Failed to authenticate token'});
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    // no token provided
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
});

router.get('/test', (req, res) => {
  return res.json({message: 'This is an authenticated route.', user: req.user});
});

module.exports = router;
