let checker = {};
const async = require('async');
const request = require('request');

checker.getAllMenus = function (date, callback){
  let baseURL = 'https://api.hfs.purdue.edu/menus/v2/locations/';
  let locations = ['Hillenbrand', 'Earhart', 'Windsor', 'Wiley', 'Ford', 'The%20Gathering%20Place'];
  let results = [];
    
  let dateString = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    
  async.forEachOf(locations, (location, index, cb) => {
    let fullURL = baseURL + location + '/' + dateString;
    
    let options = {
      url: fullURL,
      headers: {
        'Accept': 'text/json'
      }
    };
    request(options, (error, request, body) => {
      if (error)
        cb(error);
      results[index] = JSON.parse(body);
      cb();
    });
  }, (err)=>{
    if (err)
      console.log(err.message);
    callback(null, results);
  });
};

module.exports = checker;