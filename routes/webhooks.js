let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');
const dialogActions = require('../util/dialog-actions');

router.use((req, res, next) => {
	let password = req.headers['auth'];

	if (password != null && password === config.get('webhooks.password')){
		next();
	} else {
		let err = new Error('Invalid Webhooks Password');
		err.status = 401;
		next(err);
	}
});

router.use((req, res, next) => {
	let token;
	// console.log(JSON.stringify(req.body));
	if (req.body.originalRequest && req.body.originalRequest.data.user && req.body.originalRequest.data.user.accessToken) {
		// console.log(JSON.stringify(req.body.originalRequest.data));
		token = req.body.originalRequest.data.user.accessToken;
		console.log(`Got access token: ${token}`);
	}

	if (token) {
		jwt.verify(token, config.get('jwt.secret'), function (err, decoded) {
			if (err) {
				return res.status(403).send({success: false, message: 'Failed to authenticate token'});
			} else {
				User.findOne({_id: decoded.id}).then(user => {
					if (!user) next();
					else {
						req.user = user;
						next();
					}
				}).catch(err => {
					console.error(err);
					return res.status(500).json({success: false, error: err});
				});
			}
		});
	} else next();
});

router.post('/', (req, res) => {
	if (req.body.result.action === 'get_top_dining_court') {
		dialogActions.getBestDiningCourt(req)
			.then(response => {
				console.log(response);
				res.json(response);
			})
			.catch(() => res.status(500).json({speech: 'An error occurred'}));
	} else if (req.body.result.action === 'get_favorites') {
		dialogActions.getFavoritesForDiningCourt(req)
			.then(response => {
				console.log(response);
				res.json(response);
			})
			.catch(() => res.status(500).json({speech: 'An error occurred'}));
	} else {
		return res.json({speech: 'Unsupported action..'});
	}
});

module.exports = router;
