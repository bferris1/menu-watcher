let express = require('express');
let router = express.Router();
let config = require('../config');
const Favorite = require('../models/favorite');
const request = require('request').defaults({jar: true});
const validateURL = 'https://www.purdue.edu/apps/account/cas/serviceValidate';
const service = 'http://localhost:4000/import/CasRedirect';
const favoritesUrl = 'https://api.hfs.purdue.edu/menus/v2/favorites';
const ticketURL = 'https://www.purdue.edu/apps/account/cas/v1/tickets';

/* GET import page. */
router.post('/', function (req, res) {
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
        let favorites = JSON.parse(body);
        async.forEachOf(favorites.Favorite, (favorite, index, cb) => {
          let newFavorite = new Favorite({
            name: favorite.Name,
            itemID: favorite.ItemId,
            userID: req.user.id
          });
          newFavorite.save((err, favorite) => {
            if (err)
              cb(err);
            else
              cb();
          })
        }, err => {
          if (err) return res.status(500).json({success:false, error: err});
          return res.json({success: true});
        });
      });
    });
  });
});

router.get('/CasRedirect', (req, res) => {

  res.json(req.query);
  // request(options, (err, response, body) => {
  //   if (err) return res.json({error: err});
  //   // console.log(response);
  //   console.log(body);
  //   console.log(JSON.stringify(response.headers));
  //   request(favoritesUrl, (err, favoritesResponse, favoritesBody) => {
  //     if (err) return res.json({error: err});      
  //     console.log(favoritesBody);
  //     // res.send(body);
  //   });
  //   res.send(body);
  // });
  // request(favoritesUrl + '?ticket='+req.query.ticket, (err, response, body)=>{
  //   return res.json(body);
  // });
});

module.exports = router;
