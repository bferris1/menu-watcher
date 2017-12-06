let checker = {};
const async = require('async');
const request = require('request');

checker.getAllMenus = function (date, callback){
  let baseURL = 'https://api.hfs.purdue.edu/menus/v2/locations/';
  let locations = ['Hillenbrand', 'Earhart', 'Windsor', 'Wiley', 'Ford', 'The%20Gathering%20Place'];
  let results = [];

  // let dateString = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

  async.forEachOf(locations, (location, index, cb) => {
    let fullURL = baseURL + location + '/' + date;

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

checker.getSearchResults = function (query, callback) {
  let baseURL = 'https://api.hfs.purdue.edu/menus/v2/items/search/';
  // get the parameters, replace spaces with %20 and add to base url later VVV
  // req.param()
  let fullURL = baseURL + query; // change this later


  let options = {
    url: fullURL,
    headers: {
      'Accept': 'text/json'
    }
  };
  request(options, (error, request, body) => {
    if (error)
      callback(error);
    else
      callback(null, JSON.parse(body));
  });
};

checker.getFilteredFavorites = (menus, favorites, callback) => {

  let favoritesSet = new Set();
  favorites.forEach(favorite => {
    favoritesSet.add(favorite.itemID);
  });
  let diningCourts = [];

  // todo: combine these two stages?

  menus.forEach((diningCourt, courtIndex)=>{
    diningCourts[courtIndex] = {name: diningCourt.Location, meals: []};
    diningCourt.Meals.forEach((meal, mealIndex) => {
      diningCourts[courtIndex].meals[mealIndex] = {location: diningCourt.Location, name: meal.Name, Order: meal.Order, favorites: []};
      meal.Stations.forEach(station => {
        station.Items.forEach(item => {
          if (favoritesSet.has(item.ID)){
            if (diningCourts[courtIndex].meals[mealIndex].favorites.filter(favorite => (favorite.Name === item.Name)).length===0)
              diningCourts[courtIndex].meals[mealIndex].favorites.push(item);
            // meals[mealIndex].diningCourts[courtIndex].favorites.push(item);
          }
        });
      });
    });
  });

  let meals = [];
  for (let i = 0; i < 4; i++) {
    meals[i] = [];
  }
  diningCourts.forEach((diningCourt) => {
    diningCourt.meals.forEach((meal) => {
      meals[meal.Order-1].push(meal);
    });
  });

  meals.forEach(diningCourts => {
    diningCourts.sort((first, second) => {
      if (first.favorites.length > second.favorites.length)
        return -1;
      if (first.favorites.length < second.favorites.length)
        return 1;
      return 0;
    });
  });

  callback(meals);
};



module.exports = checker;