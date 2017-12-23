const checker = require('./menu-checker');
const User = require('../models/user');
const Favorite = require('../models/favorite');

let actions = {};

const getCurrentMealIndex = () => {
	const now = new Date();
	let hour = now.getHours();
	if (hour < 10)
		return 0;
	else if (hour < 14)
		return 1;
	else if (hour < 17)
		return 2;
	else
		return 3;
};

const convertMealIndex = (mealName) => {
	const meals = ['breakfast', 'lunch', 'late lunch', 'dinner'];
	let index = meals.indexOf(mealName.toLowerCase());
	if (index === -1)
		return getCurrentMealIndex();
	return index;
};

const getCurrentDateString = () => {
	// todo: actually format current date
	return '2017-12-05';
};

const getFavoritesForUser = (user) => {
	return Favorite.find({userID: user._id}).exec().then(user => user).catch(() => null);
};

const formatFiltered = (filtered, mealIndex) => {
	let best = filtered[mealIndex][0];
	let speech = `Your top dining court for ${best.name} is ${best.location}, with ${best.favorites.length} ${best.favorites.length === 1 ? 'favorite' : 'favorites'}`;

	return {
		speech
	};

};


// takes favorites and parameters from DialogFlow, and returns a DialogFlow response object
actions.getBestDiningCourt = (request) => {
	let requestBody = request.body;
	let date = requestBody.result.parameters.date || getCurrentDateString();
	let mealIndex = convertMealIndex(requestBody.result.parameters.meal);

	// temporary because there are no menus over break
	date = '2017-12-05';


	let originalRequest = requestBody.originalRequest;
	if (originalRequest && originalRequest.source === 'telegram') {
		// this is a telegram request
		let telegramUser = originalRequest.data.message.from.username;
		return User.findOne({telegramUsername: telegramUser}).exec()
			.then(user => getFavoritesForUser(user))
			.then(favorites => checker.getFilteredFavoritesForDate(date, favorites))
			.then(filtered => formatFiltered(filtered, mealIndex));
	} else if (originalRequest && originalRequest.source === 'google') {
		// this is a google request
		console.log('handling google request');
		return getFavoritesForUser(request.user)
			.then(favorites => checker.getFilteredFavoritesForDate(date, favorites))
			.then(filtered => formatFiltered(filtered, mealIndex));
	} else {
		return Promise.resolve({speech: 'Non-telegram methods are not supported yet.'});
	}

};


actions.getFavoritesForDiningCourt = () => {


};

module.exports = actions;