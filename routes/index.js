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
