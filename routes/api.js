let express = require('express');
let router = express.Router();
let config = require('../config');
const async = require('async');
const request = require('request').defaults({jar: true});
const checker = require('../util/menu-checker');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const accountRoutes = require('./account');
const webhookRoutes = require('./webhooks');
const APIError = require('../util/api-error');

router.get('/', (req, res) => {
	res.json({success: true, message: 'Welcome to the api.'});
});

router.use('/webhooks', webhookRoutes);

router.get('/menus', (req, res, next) => {
	let date = new Date();
	let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	checker.getAllMenus(dateString).then(menus => {
		return res.json({success: true, menus});

	}).catch(err => {
		next(err);
	});
});

router.get('/search/:query', (req, res, next) => {
	checker.getSearchResults(req.params.query).then(searchResults => {
		return res.json({success: true, searchResults});
	}).catch(err => {
		next(err);
	});
});


router.post('/auth', (req, res, next) => {

	if (!req.body.email || !req.body.password) {
		throw new APIError('Email and password are required.', 400);
	}

	User.findOne({email: req.body.email}).select('email, password').exec().then(user => {
		if (!user) {
			throw new APIError('No user with that email address.', 400);
		}
		return user.comparePassword(req.body.password);
	}).then(({isValid, user}) => {
		if (isValid) {
			// correct password
			let token = jwt.sign({email: user.email, id: user._id}, config.get('jwt.secret'));
			return res.json({success: true, token});
		} else {
			throw new APIError('Incorrect Password', 401);
		}
	}).catch(err => next(err));
})
;

router.post('/register',
	[
		check('email').isEmail().withMessage('Email address is invalid.').trim(),
		check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters.')
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new APIError(errors.array()[0].msg, 400);
		}

		// todo: flatten promises
		User.findOne({email: req.body.email}).then(existingUser => {
			if (existingUser)
				throw new APIError('A user with that email address already exists.', 400);
			let user = new User({
				email: req.body.email,
				password: req.body.password
			});
			user.save().then(user => {
				jwt.sign({
					email: user.email,
					id: user._id
				}, config.get('jwt.secret'), function (err, token) {
					if (err) return res.status(500).json({success: false});
					return res.json({success: true, user, token});
				});
			}).catch(reason => {
				next(reason);
			});
		}).catch(err => {
			next(err);
		});

	});

router.use((req, res, next) => {
	let token = req.body.token || req.params.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, config.get('jwt.secret'), function (err, decoded) {
			if (err) {
				throw new APIError('Failed to authenticate token.', 403);
			} else {
				User.findOne({_id: decoded.id}).then(user => {
					if (!user) throw new APIError('Your user ID is invalid.', 401);
					else {
						req.user = decoded;
						next();
					}
				}).catch(err => {
					next(err);
				});
			}
		});
	} else {
		// no token provided
		throw new APIError('No token provided.', 401);
	}
});

router.use('/account', accountRoutes);

router.get('/test', (req, res) => {
	return res.json({message: 'This is an authenticated route.', user: req.user});
});

router.get('/favorites', (req, res) => {
	Favorite.find({userID: req.user.id}).sort('-createdAt').exec().then(favorites => {
		return res.json({success: true, favorites});
	}).catch(err => {
		return res.json({success: false, error: err});
	});
});

router.post('/favorites', (req, res, next) => {
	if (!req.body.itemID && !req.body.itemName) {
		throw new APIError('Invalid id or name.', 400);
	}
	Favorite.find({itemID: req.body.itemID, userID: req.user.id}).then(favorites => {
		if (favorites.length > 0) {
			console.log(favorites);
			throw new APIError('Item is already a favorite!', 400);
		}
		let favorite = new Favorite({
			itemID: req.body.itemID,
			itemName: req.body.itemName,
			userID: req.user.id
		});
		favorite.save().then(favorite => {
			return res.json({success: true, favorite});
		}).catch(err => {
			next(err);
		});

	});
});

router.delete('/favorites/:favoriteID', (req, res, next) => {
	Favorite.remove({itemID: req.params.favoriteID}).then(() => {
		return res.json({success: true});
	}).catch(err => {
		next(err);
	});
});


router.get('/filtered/:date', (req, res, next) => {

	Favorite.find({userID: req.user.id}).then(favorites => {
		return checker.getFilteredFavoritesForDate(req.params.date, favorites);
	}).then(filtered => {
		return res.json({success: true, filtered});
	}).catch(err => {
		next(err);
	});
});


// todo: use promises (request-promise) to clean this up
router.post('/import', function (req, res) {
	const favoritesUrl = 'https://api.hfs.purdue.edu/menus/v2/favorites';
	const ticketURL = 'https://www.purdue.edu/apps/account/cas/v1/tickets';

	// user must enter username and password
	if (!req.body.user && !req.body.password) {
		throw new APIError('Credentials Required.', 400);
	}
	// options to get ticket
	let options = {
		method: 'POST',
		uri: ticketURL,
		form: {
			username: req.body.user,
			password: req.body.password
		}
	};
	// send credentials to request a TGT
	request(options, (err, response) => {
		if (err || response.statusCode !== 201) return res.status(500).json({
			success: false,
			error: 'Incorrect Credentials'
		});
		console.log(response.headers.location);
		let ticketOptions = {
			method: 'POST',
			uri: response.headers.location,
			form: {
				service: favoritesUrl
			}
		};
		// send another request to the endpoint returned by the previous request (with TGT)
		// this request sends the service for the ticket which is returned in the response body
		request(ticketOptions, (ticketErr, ticketRes, ticketBody) => {
			console.log(ticketRes);
			console.log(ticketRes.statusCode);
			if (ticketErr) throw new APIError('Unable to access Purdue favorites API.', 500);

			// the ticket is sent as a query parameter with the favorites request
			let favoriteOptions = {
				method: 'GET',
				uri: favoritesUrl,
				qs: {
					ticket: ticketBody
				},
				headers: {
					'Accept': 'text/json'
				}
			};

			// finally, send a request to the dining API with the ticket
			request(favoriteOptions, (fErr, fRes, fBody) => {
				let favorites = JSON.parse(fBody);
				// save each favorite to the database
				async.forEachOf(favorites.Favorite, (favorite, index, cb) => {
					Favorite.findOneAndUpdate(
						{itemID: favorite.ItemId, userID: req.user.id},
						{
							itemName: favorite.ItemName,
							itemID: favorite.ItemId,
							userID: req.user.id
						},
						{upsert: true}
					).then(result => {
						console.log(result);
						cb();
					}).catch(err => {
						console.error(err);
						cb(err);
					});
				}, err => {
					if (err) throw new APIError('Error saving favorites to database.', 500);
					return res.json({success: true});
				});
			});
		});
	});
});


// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
	let status = err.status || 500;
	let message = err.message || 'An unknown error occurred.';
	if (status === 500)
		console.error(err);
	else
		console.log(err);
	res.status(err.status || 500).json({success: false, error: message});
});

module.exports = router;
