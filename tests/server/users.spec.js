const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let roleId1, roleId2, adminToken;

describe('User API', function () {

  before(function () {
    return models.Role.create(fakeData.adminRole)
      .then((roleData) => {
        roleId1 = roleData.dataValues.id;
        return models.Role.create(fakeData.regularRole)
      })
      .then((roleData) => {
        roleId2 = roleData.dataValues.id;
      });
  });

  after((done) => {
    models.sequelize.sync({
        force: true
      })
      .then(() => {
        done();
      });
  });

  it('creates a new user with first and last names', function (done) {;
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.firstUser)
      .expect(201)
      .end(function (err, res) {
        adminToken = res.body.token;
        expect(res.body.token).to.exist;
        expect(res.body.userInfo).to.have.property('firstName');
        expect(res.body.userInfo).to.have.property('lastName');
        if (err) return done(err);
        done();
      });
  });

   it('validates that a new user must provide unique details', function (done) {;
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.firstUser)
      .expect(409)
      .end(function (err, res) {
        expect(res.body.message).to.equals('A user with this email already exists!');
        if (err) return done(err);
        done();
      });
   });

    it('validates that each new user has a role assigned', function (done) {;
    request(app)
      .get('/users/1')
      .set('Content-Type', 'application/json')
      .expect(201)
      .end(function (err, res) {
        expect(res.body.validUser).to.have.property('RoleId');
        if (err) return done(err);
        done();
      });
   });

  it('validates that all Users are accessible only when requested by admin', function (done) {
    request(app)
      .get('/users')
      .set('Authorization',adminToken)
      .expect(200)
      .end(function (err, res) {
        expect((res.body.users).length).to.equals(1);
        if (err) return done(err);
        done();
      });
  });

   it('validates that all users are not accessible to non-admins', function (done) {
    request(app)
      .get('/users')
      .expect(401)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Please Login!');
        if (err) return done(err);
        done();
      });
  });
});