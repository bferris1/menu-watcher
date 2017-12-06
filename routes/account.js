let express = require('express');
let router = express.Router();
let User = require('../models/user');

router.get('/', (req, res) => {
  User.findById(req.user.id).then(user => {
    return res.json({success: true, user});
  }).catch(err => {
    return res.status(500).json({success:false, error: err});
  })
});

router.post('/', (req, res) => {

});


module.exports = router;