let express = require('express');
let router = express.Router();
let config = require('../config');
const async = require('async');
const request = require('request').defaults({jar: true});
const checker = require('../util/menu-checker');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
  res.json({success: true, message: 'Welcome to the api.'});
});

router.get('/menus', (req, res) => {
  let date = new Date();
  let dateString = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  checker.getAllMenus(dateString, (err, menus) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err
      });
    }
    return res.json({success: true, menus});
  });
});

router.get('/search/:query', (req, res) => {
  checker.getSearchResults(req.params.query, (err, searchResults) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err
      });
    }
    return res.json({success: true, searchResults});
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

router.get('/favorites', (req, res) => {
  Favorite.find({userID: req.user.id}).then(favorites => {
    return res.json({success: true, favorites});
  }).catch(err => {
    return res.json({success: false, error: err});
  });
});

router.post('/favorites', (req, res) => {
  if (!req.body.itemID && !req.body.itemName){
    return res.status(400).json({success: false, message: 'Invalid id or name.'});
  }
  Favorite.find({itemID: req.body.itemID}).then(favorites => {
    if (favorites.length > 0){
      console.log(favorites);
      return res.status(400).json({success: false, message: 'Item is already a favorite!'});
    }
    let favorite = new Favorite({
      itemID: req.body.itemID,
      itemName: req.body.itemName,
      userID: req.user.id
    });
    favorite.save().then(favorite => {
      return res.json({success: true, favorite});
    }).catch(err => {
      return res.status(500).json({success: false, error: err});
    });

  });
});

router.delete('/favorites/:favoriteID', (req, res) => {
  Favorite.remove({_id: favoriteID}).then(() => {
    return res.json({success: true});
  })
});


router.get('/filtered/:date', (req, res) => {
  checker.getAllMenus(req.params.date, (err, menus) => {
    if (err) return res.status(500).json({error:err});
    Favorite.find({userID: req.user.id}).then(favorites => {
      checker.getFilteredFavorites(menus, favorites, filtered => {
        return res.json({success:true, filtered});
      })
    })
  })
});



router.post('/import', function (req, res) {
  // const validateURL = 'https://www.purdue.edu/apps/account/cas/serviceValidate';
  // const service = 'http://localhost:4000/import/CasRedirect';
  const favoritesUrl = 'https://api.hfs.purdue.edu/menus/v2/favorites';
  const ticketURL = 'https://www.purdue.edu/apps/account/cas/v1/tickets';

  // res.redirect('https://www.purdue.edu/apps/account/cas/login?service=https://api.hfs.purdue.edu%2FMenus%2FHome%2FCasRedirect%3FredirectUrl%3D' + encodeURIComponent(config.get('hosting.url')))
  // let dest = 'https://www.purdue.edu/apps/account/cas/login?service='+ encodeURIComponent(service);
  if (!req.body.user && !req.body.password){
    return res.status(400).json({success: false, message: 'Credentials required.'});
  }
  let options = {
    method: 'POST',
    uri: ticketURL,
    form: {
      username: req.body.user,
      password: req.body.password
    }
  };
  request(options, (err, response, body)=>{
    if (err) return res.status(500).json({err});
    // res.send(body);
    console.log(response.headers.location);
    let ticketOptions = {
      method: 'POST',
      uri: response.headers.location,
      form: {
        service: favoritesUrl
      }
    };
    request(ticketOptions, (ticketErr, ticketRes, ticketBody) => {
      if (ticketErr) return res.status(500).json({error: ticketErr});
      // res.send(ticketBody);
      let favoriteOptions = {
        method: 'GET',
        uri: favoritesUrl,
        qs: {
          ticket: ticketBody
        },
        headers: {
          'Accept': 'text/json'
        }
      };

      request(favoriteOptions, (fErr, fRes, fBody) => {
        console.log(fBody);
        let favorites = JSON.parse(fBody);
        async.forEachOf(favorites.Favorite, (favorite, index, cb) => {
          let newFavorite = new Favorite({
            itemName: favorite.ItemName,
            itemID: favorite.ItemId,
            userID: req.user.id
          });
          newFavorite.save((err, created) => {
            if (err)
              cb(err);
            else {
              console.log(created);
              cb();
            }
          });
        }, err => {
          if (err) return res.status(500).json({success: false, error: err});
          return res.json({success: true});
        });
      });
    });
  });
});




module.exports = router;
