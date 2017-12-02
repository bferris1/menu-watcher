const express = require('express');
const router = express.Router();
const checker = require('../util/menu-checker');

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

module.exports = router;
