const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
let app = require('../app');
const expect = chai.expect;
const assert = chai.assert;
const dialog = require('../util/dialog-actions');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

after(function () {
	mongoose.connection.close();
});

let mockRequest = require('./mock-top-dining-court-request');
let telegramSource = {
	source: 'telegram',
	data: {
		message: {
			from: {
				username: 'ursus_maritimus'
			}
		}
	}
};

let googleSource = {
	source: 'google',
	data: {
		user: {
			userId: 'myuserID',
			accessToken: ''
		}
	}

};

describe('Telegram Dialog Actions', function () {
	this.timeout(10000);
	mockRequest.originalRequest = telegramSource;
	it('should get top dining court for current meal', function (done) {
		let promise = dialog.getBestDiningCourt({body: mockRequest});
		assert.ok((promise instanceof Promise));
		promise.then(result => {
			console.log(result);
			expect(result).to.be.an('object').that.has.property('speech');
			done();
		}).catch(err => done(err));
	});
	it('should get top dining court over HTTP API', function (done) {
		chai.request(app)
			.post('/api/webhooks')
			.send(mockRequest)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).to.be.an('object').that.has.property('speech');
				console.log(res.body);
				done();
			});
	});
});


describe('Google Dialog Actions', function () {
	let googleBody = {};
	Object.assign(googleBody, mockRequest);
	googleBody.originalRequest = googleSource;
	it('should get top dining court over HTTP API', function (done) {
		chai.request(app)
			.post('/api/webhooks')
			.send(mockRequest)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.body).to.be.an('object').that.has.property('speech');
				console.log(res.body);
				done();
			});
	});
});