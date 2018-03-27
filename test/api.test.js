const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const checker = require('../util/menu-checker');
const User = require('../models/user');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let should = require('chai').should();
let app = require('../app');
let testUser = {email: 'ben@test.com', password: 'asdffdsa', telegramUsername: 'coolUsername'};


after(function () {
	mongoose.connection.close();
});

describe('Menu Checker', function () {
	const TEST_DATE_STRING = '2017-12-5';
	const testFavorites = [
		{itemID: 'df0929e6-59f6-4938-a2f3-b681cd5b10c4'},
		{itemID: '24d7a7f9-fd9e-45ff-a604-a8c36a300094'},
		{itemID: '3b0a8ba6-f1c5-44da-bb4a-10b6261dac75'},
		{itemID: '0c721f3d-972c-4a55-b32d-4ee7ac90157d'}
	];

	it('should get all menus successfully', function (done) {
		this.timeout(5000);
		checker.getAllMenus(TEST_DATE_STRING).then(menus => {
			console.log(menus);
			expect(menus).to.be.an('array').that.has.length(6);
			done();
		}).catch(err => done(err));
	});
	it('should filter favorites successfully', function (done) {
		this.timeout(8000);
		checker.getAllMenus(TEST_DATE_STRING).then(menus => {
			expect(menus).to.be.an('array').that.has.length(6);
			return checker.getFilteredFavorites(menus, testFavorites);
		}).then(filtered => {
			expect(filtered).to.be.an('array').that.has.length(4);
			done();
		}).catch(err => done(err));
	});
	it('should filter favorites for a date', function (done) {
		checker.getFilteredFavoritesForDate(TEST_DATE_STRING, testFavorites).then(filtered => {
			expect(filtered).to.be.an('array').that.has.length(4);
			done();
		}).catch(err => done(err));
	});
});

describe('Menu API', function () {
	describe('Public Functions', function () {
		it('should get all menus', function (done) {
			chai.request(app)
				.get('/api/menus')
				.end((err, res) => {
					if (err) done(err);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object').that.has.property('success').that.equals(true);
					expect(res.body).to.have.property('menus').that.is.an('array').that.has.length(6);
					done();
				});
		});
	});
	describe('Authenticated Functionality', function () {
		it('should reject unauthenticated requests to account endpoint', function (done) {
			chai.request(app)
				.get('/api/account')
				.end((err, res) => {
					if (err) done(err);
					res.should.have.status(401);
					res.body.should.be.an('object').that.has.property('success').that.equals(false);
					done();
				});
		});
		it('should require email and password when logging in', function (done) {
			chai.request(app)
				.post('/api/auth')
				.end((err, res) => {
					if (err) done(err);
					res.should.have.status(400);
					res.body.should.be.an('object').that.has.property('success').that.equals(false);
					done();
				});
		});
		it('should register user successfully', function (done) {
			chai.request(app)
				.post('/api/register')
				.send(testUser)
				.end((err, res) => {
					if (err) done(err);
					console.log(res.body);
					res.should.have.status(200);
					testUser.token = res.body.token;
					done();
				});
		});
		it('should get user favorites', function (done) {
			chai.request(app)
				.get('/api/favorites')
				.set('x-access-token', testUser.token)
				.end((err, res) => {
					if (err) done(err);
					console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.an('object')
						.that.has.property('favorites')
						.that.is.an('array')
						.that.has.length(0);
					done();
				});
		});
		it('should add favorite', function (done) {
			let testFavorite = {itemName: 'test', itemID: 'testing'};
			chai.request(app)
				.post('/api/favorites')
				.send(testFavorite)
				.set('x-access-token', testUser.token)
				.end((err, res) => {
					if (err) done(err);
					console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.an('object')
						.that.has.property('favorite').that.includes(testFavorite);
					done();
				});
		});
		it('should delete user successfully', function (done) {
			chai.request(app)
				.delete('/api/account')
				.set('x-access-token', testUser.token)
				.end((err, res) => {
					if (err) done(err);
					res.should.have.status(200);
					console.log(res.body);
					delete testUser.token;
					done();
				});
		});
	});

});

describe('User', function () {

	it('should be created successfully', function (done) {
		let newUser = new User(testUser);
		newUser.save().then(user => {
			console.log(user);
			delete testUser.password;
			expect(user).to.include(testUser);
			testUser._id = user._id;
			done();
		})
			.catch(err => done(err));
	});

	it('should be deleted successfully', function (done) {
		User.remove({email: testUser.email}).then(() => {
			done();
		}).catch(err => {
			done(err);
		});
	});
});