const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');

describe('User API', function () {
it('validates that data for all users is accessible', function (done) {
  request(app)
    .get('/users/')
    .set('Accept', 'application/json')
    .expect(201)
    .end(function (err, res) {
      if (err) return done(err);
      done();
    });
});

it('validates that data for specific users is accessible', function (done) {
  request(app)
    .get('/users/3')
    .set('Accept', 'application/json')
    .expect(201)
    .end(function (err, res) {
      expect(res.body.validUser).to.have.property('username');
      expect(res.body.validUser).to.have.property('id');
      if (err) return done(err);
      done();
    });
});

it('validates that a new user created has both first and last names', function (done) {
  request(app)
    .post('/users')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      "id": 1,
      "username": "jdoe",
      "firstname": "jane",
      "lastname": "doe",
      "email": "jane@doe.com",
      "password": "testUser",
      "createdAt": "1981-09-20T00:00:00.000Z",
      "updatedAt": "2017-01-21T14:48:16.775Z",
      "RoleId": 1
    })
    .expect(201)
    .end(function (err, res) {
      expect(res.body.users.firstname).to.equals('jane');
      expect(res.body.users.lastname).to.equals('doe');
      if (err) return done(err);
      done();
    });
});
it('validates that a role is defined for a new user', function (done) {
    request(app)

});

});

