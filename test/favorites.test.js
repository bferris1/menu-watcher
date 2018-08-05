const checker = require('../util/menu-checker');
const chai = require('chai');
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
const config = require('../config');
const username = config.get('testing.purdue.username');
const password = config.get('testing.purdue.password');
const APIError = require('../util/api-error');


chai.use(chaiAsPromised);
describe('Favorites import', function () {
	this.timeout(5000);
	it('should require username', function () {
		return checker.getFavorites(null, 'fdsa').should.be.rejected;
	});
	it('should require password', function () {
		return checker.getFavorites('asdf', null).should.be.rejected;
	});
	it('should provide error for incorrect credentials', function () {
		return checker.getFavorites('wrong', 'credentials').should.be.rejectedWith(APIError, 'Incorrect Credentials');
	});
	it('should retrieve favorites successfully', function () {
		return checker.getFavorites(username, password).should.eventually.be.an('array');
	});
});