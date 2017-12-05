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


checker.getFilteredFavorites = (menus, favorites, callback) => {
  let meals = new Array(4);
  for (let i = 0; i < meals.length; i++) {
    meals[i] = {name: '', diningCourts: []};
  }

  let favoritesSet = new Set();
  favorites.forEach(favorite => {
    favoritesSet.add(favorite.itemID);
  });
  let diningCourts = [];

  menus.forEach((diningCourt, courtIndex)=>{
    diningCourts[courtIndex] = {name: diningCourt.Location, meals: []};
    diningCourt.Meals.forEach((meal, mealIndex) => {
      diningCourts[courtIndex].meals[mealIndex] = {name: meal.Name, favorites: []};
      meal.Stations.forEach(station => {
        station.Items.forEach(item => {
          if (favoritesSet.has(item.ID)){
            diningCourts[courtIndex].meals[mealIndex].favorites.push(item);
            // meals[mealIndex].diningCourts[courtIndex].favorites.push(item);
          }
        });
      });
    });
  });
  callback(diningCourts);
};

module.exports = checker;