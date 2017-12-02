const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const expect = chai.expect;
const checker = require('../util/menu-checker');

describe('Menu Checker', function () {
  it('should get all menus successfully', function (done) {
    checker.getAllMenus(new Date(), (err, menus) => {
      if (err) done (err);
      expect(menus).to.be.an('array').that.has.length(6);
      done();
	})
  })
});

describe('Menu API', function () {

  it('should get all menus', function (done) {
    chai.request(app)
      .get('/api/menus')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').that.has.property('success').that.equals(true);
        expect(res.body).to.have.property('menus').that.is.an('array').that.has.length(6);
        done();
      })
  });
});