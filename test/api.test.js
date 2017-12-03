const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const checker = require('../util/menu-checker');
const User = require('../models/User');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/*before(function () {
  mongoose.connect('mongodb://localhost:27017/menu-tools', {useMongoClient: true});
});*/

after(function(){
  mongoose.connection.close();
});

describe('Menu Checker', function () {
  it('should get all menus successfully', function (done) {
    this.timeout(5000);
    checker.getAllMenus(new Date(), (err, menus) => {
      if (err) done (err);
      expect(menus).to.be.an('array').that.has.length(6);
      done();
    });
  });
});

describe('Menu API', function () {
  let app = require('../app');
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

describe('User', function () {
  let user = {email: 'ben@test.com', password: 'asdffdsa'};

  it('should be created successfully', function (done) {
    let newUser = new User(user);
    newUser.save().then(user => {
      console.log(user);
      done();
    })
      .catch(err => done(err));
  });
});