let express = require('express');
let router = express.Router();
let config = require('../config');
const request = require('request').defaults({jar: true});
const validateURL = 'https://www.purdue.edu/apps/account/cas/serviceValidate';
const service = 'http://localhost:4000/auth/CasRedirect';

/* GET import page. */


module.exports = router;
