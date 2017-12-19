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


router.get('/', (req, res) => {
	res.json({success: true, message: 'Welcome to the api.'});
});

router.get('/menus', (req, res) => {
	let date = new Date();
	let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	checker.getAllMenus(dateString, (err, menus) => {
		if (err) {
			return res.status(500).json({
				success: false,
				error: err
			});
		}
		return res.json({success: true, menus});
	});
});

router.get('/search/:query', (req, res) => {
	checker.getSearchResults(req.params.query, (err, searchResults) => {
		if (err) {
			return res.status(500).json({
				success: false,
				error: err
			});
		}
		return res.json({success: true, searchResults});
	});
});


router.post('/auth', (req, res) => {

	if (!req.body.email || !req.body.password) {
		return res.status(400).json({
			success: false,
			error: 'Email and password are required.'
		});
	}

	User.findOne({email: req.body.email}).select('email, password').exec().then(user => {
		if (!user) {
			return res.status(400).json({success: false, error: 'No user with that email address.'});
		}
		user.comparePassword(req.body.password, function (err, isMatch) {
			if (err) {
				return res.status(500).json({
					success: false,
					error: err
				});
			}
			if (isMatch) {
				jwt.sign({
					email: user.email,
					id: user._id
				}, config.get('jwt.secret'), function (err, token) {
					if (err) return res.status(500).json({success: false});
					return res.json({success: true, token: token});
				});
			} else {
				return res.status(401).json({success: false, error: 'Incorrect Password'});
			}
		});
	});
});

router.post('/register', [
		check('email').isEmail().withMessage('Email address is invalid.').trim(),
		check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters.')],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({success: false, error: errors.array()[0].msg});
		}
		User.findOne({email: req.body.email}).then(existingUser => {
			if (existingUser)
				return res.status(400).json({success: false, error: 'A user with that email already exists.'});

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
				console.log(reason);
				return res.status(500).json({success: false, error: reason});
			});
		}).catch(err => {
			return res.status(500).json({success: false, error: err});
		});

	});

router.use((req, res, next) => {
	let token = req.body.token || req.params.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, config.get('jwt.secret'), function (err, decoded) {
			if (err) {
				return res.status(403).send({success: false, message: 'Failed to authenticate token'});
			} else {
				User.findOne({_id: decoded.id}).then(user => {
					if (!user) return res.status(401).json({success: false, error: 'Your user ID is invalid.'});
					else {
						req.user = decoded;
						next();
					}
				}).catch(err => {
					console.error(err);
					return res.status(500).json({success: false, error: err});
				});
			}
		});
	} else {
		// no token provided
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

router.use('/account', accountRoutes);

router.get('/test', (req, res) => {
	return res.json({message: 'This is an authenticated route.', user: req.user});
});

router.get('/favorites', (req, res) => {
	Favorite.find({userID: req.user.id}).then(favorites => {
		return res.json({success: true, favorites});
	}).catch(err => {
		return res.json({success: false, error: err});
	});
});

router.post('/favorites', (req, res) => {
	if (!req.body.itemID && !req.body.itemName) {
		return res.status(400).json({success: false, message: 'Invalid id or name.'});
	}
	Favorite.find({itemID: req.body.itemID, userID: req.user.id}).sort('createdAt').exec().then(favorites => {
		if (favorites.length > 0) {
			console.log(favorites);
			return res.status(400).json({success: false, message: 'Item is already a favorite!'});
		}
		let favorite = new Favorite({
			itemID: req.body.itemID,
			itemName: req.body.itemName,
			userID: req.user.id
		});
		favorite.save().then(favorite => {
			return res.json({success: true, favorite});
		}).catch(err => {
			return res.status(500).json({success: false, error: err});
		});

	});
});

router.delete('/favorites/:favoriteID', (req, res) => {
	Favorite.remove({itemID: req.params.favoriteID}).then(() => {
		return res.json({success: true});
	}).catch(err => {
		return res.status(500).json({success: false, error: err});
	});
});


router.get('/filtered/:date', (req, res) => {
	checker.getAllMenus(req.params.date, (err, menus) => {
		if (err) return res.status(500).json({error: err});
		Favorite.find({userID: req.user.id}).then(favorites => {
			checker.getFilteredFavorites(menus, favorites, filtered => {
				return res.json({success: true, filtered});
			});
		});
	});
});


// todo: use promises (request-promise) to clean this up
router.post('/import', function (req, res) {
	const favoritesUrl = 'https://api.hfs.purdue.edu/menus/v2/favorites';
	const ticketURL = 'https://www.purdue.edu/apps/account/cas/v1/tickets';

	// user must enter username and password
	if (!req.body.user && !req.body.password) {
		return res.status(400).json({success: false, message: 'Credentials required.'});
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
		if (err || response.statusCode != 201) return res.status(500).json({
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
			if (ticketErr) return res.status(500).json({error: 'Unable to access favorites API.'});

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
					if (err) return res.status(500).json({success: false, error: 'Error saving favorites to database.'});
					return res.json({success: true});
				});
			});
		});
	});
});


module.exports = router;
