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

const formatFavoritesListSpeech = (filtered, mealIndex, location) => {
	console.log(`Getting favorites for meal ${mealIndex} at ${location}`);
	let best;
	console.log(JSON.stringify(filtered[mealIndex]));
	if (location)
		best = filtered[mealIndex].filter(diningCourt => diningCourt.location.toLowerCase() === location.toLowerCase());
	else
		best = [filtered[mealIndex][0]];
	console.log(JSON.stringify(best));
	let speech;
	if (best.length !== 1) {
		console.log(`Length of best was ${best.length}`);
		speech = `It looks like ${location} isn't serving that meal.`;
	} else {
		best = best[0];
		speech = `Your favorites for ${best.name} at ${best.location} are ${best.favorites.map(favorite => favorite.Name).slice(0, -1).join(', ')}, and ${best.favorites[best.favorites.length - 1].Name}`;
	}
	return {speech};
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
	} else if (request.user) {
		// this is a google request
		console.log('handling google request');
		return getFavoritesForUser(request.user)
			.then(favorites => checker.getFilteredFavoritesForDate(date, favorites))
			.then(filtered => formatFiltered(filtered, mealIndex));
	} else {
		return Promise.resolve({speech: 'Sorry, the request method appears to be invalid.'});
	}

};


actions.getFavoritesForDiningCourt = (request) => {
	let requestBody = request.body;
	let date = requestBody.result.parameters.date || getCurrentDateString();
	let mealIndex = convertMealIndex(requestBody.result.parameters.meal);
	let diningCourt = requestBody.result.parameters.diningCourt;

	date = '2017-12-05';

	if (request.user) {
		// user is authenticated with JWT
		return getFavoritesForUser(request.user)
			.then(favorites => checker.getFilteredFavoritesForDate(date, favorites))
			.then(filtered => formatFavoritesListSpeech(filtered, mealIndex, diningCourt));
	} else {
		return Promise.resolve({speech: 'Invalid request.'});
	}


};

module.exports = actions;