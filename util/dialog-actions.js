const checker = require('./menu-checker');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const moment = require('moment');

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

const getMealName = (mealIndex) => {
	if (mealIndex < 0 || mealIndex > 3)
		return 'Unknown Meal';
	const meals = ['breakfast', 'lunch', 'late lunch', 'dinner'];
	return meals[mealIndex];
};

const getCurrentDateString = () => {
	let now = new Date();
	return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const getFavoritesForUser = (user) => {
	return Favorite.find({userID: user._id}).exec().then(user => user).catch(() => null);
};

const formatFiltered = (filtered, mealIndex, date) => {
	let speech = `It looks like there aren't any dining courts serving that meal.`;
	if (filtered[mealIndex] == null || filtered[mealIndex].length === 0 || filtered[mealIndex][0] === null) {
		speech = `It looks like there aren't any dining courts serving ${getMealName(mealIndex)} ${date}.`;

	} else {
		let best = filtered[mealIndex][0];
		if (best.favorites.length === 0)
			speech = `It doesn't look like any of your favorites are being served for ${best.name} ${date}`;
		else
			speech = `Your top dining court for ${best.name} ${date} is ${best.location}, with ${best.favorites.length} ${best.favorites.length === 1 ? 'favorite' : 'favorites'}.`;
	}

	speech += ' Would you like to know anything else?';

	return {
		speech
	};

};

actions.formatDateText = (dateString) => {
	let date = moment(dateString, 'YYYY-MM-DD');
	return date.calendar(null, {
		sameDay: '[Today]',
		nextDay: '[Tomorrow]',
		nextWeek: '[on] dddd',
		lastDay: '[Yesterday]',
		lastWeek: '[Last] dddd',
		sameElse: 'YYYY-MM-DD'
	});
};

const formatFavoritesListSpeech = (filtered, mealIndex, location, date = getCurrentDateString()) => {
	console.log(`Getting favorites for meal ${mealIndex} at ${location} ${date}`);
	let best;
	// console.log(JSON.stringify(filtered[mealIndex]));
	if (location)
		best = filtered[mealIndex].filter(diningCourt => diningCourt.location.toLowerCase() === location.toLowerCase());
	else
		best = [filtered[mealIndex][0]];
	console.log(JSON.stringify(best));
	let speech = `It looks like ${location} isn't serving that meal ${date}`;
	if (best.length !== 1) {
		console.log(`Length of best was ${best.length}`);
		speech = `It looks like ${location} isn't serving that meal ${date}.`;
	} else {
		best = best[0];
		if (best.favorites.length === 0) {
			speech = `${best.location} is not serving any of your favorites for ${best.name} ${date}.`;
		}
		else if (best.favorites.length === 1) {
			speech = `Your favorite for ${best.name} ${date} at ${best.location} is ${best.favorites[0].Name}.`;
		} else
			speech = `Your favorites for ${best.name} ${date} at ${best.location} are ${best.favorites.map(favorite => favorite.Name).slice(0, -1).join(', ')}, and ${best.favorites[best.favorites.length - 1].Name}.`;
	}

	speech += ' Would you like to know anything else?';

	return {speech};
};

const getUserForRequest = (request) => {
	let originalRequest = request.body.originalRequest;

	if (request.user) return Promise.resolve(request.user);
	else if (originalRequest && originalRequest.source === 'telegram') {
		let telegramUser = originalRequest.data.message.from.username;
		return User.findOne({telegramUsername: telegramUser}).exec();
	} else {
		return Promise.reject('Couldn\'t find user. Possibly invalid request method.');
	}
};


// takes favorites and parameters from DialogFlow, and returns a DialogFlow response object
actions.getBestDiningCourt = (request) => {
	let requestBody = request.body;
	// Dialogflow date format is also used by the dining API
	let date = requestBody.result.parameters.date || getCurrentDateString();
	let friendlyDate = actions.formatDateText(date);
	let mealIndex = convertMealIndex(requestBody.result.parameters.meal);


	return getUserForRequest(request)
		.then(user => getFavoritesForUser(user))
		.then(favorites => checker.getFilteredFavoritesForDate(date, favorites))
		.then(filtered => formatFiltered(filtered, mealIndex, friendlyDate));
};


actions.getFavoritesForDiningCourt = (request) => {
	let requestBody = request.body;
	let date = requestBody.result.parameters.date || getCurrentDateString();
	let friendlyDate = actions.formatDateText(date);
	let mealIndex = convertMealIndex(requestBody.result.parameters.meal);
	let diningCourt = requestBody.result.parameters.diningCourt;


	return getUserForRequest(request)
		.then(user => getFavoritesForUser(user))
		.then(favorites => checker.getFilteredFavoritesForDate(date, favorites))
		.then(filtered => formatFavoritesListSpeech(filtered, mealIndex, diningCourt, friendlyDate));

};

module.exports = actions;