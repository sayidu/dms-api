'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let adminRoleId, regRoleId, adminToken;

describe('User API', () => {

  before(() => {
    return models.Role.create(fakeData.adminRole)
      .then((roleData) => {
        adminRoleId = roleData.dataValues.id;
        return models.Role.create(fakeData.regularRole)
      })
      .then((roleData) => {
        regRoleId = roleData.dataValues.id;
      });
  });

  after(() => models.User.sequelize.sync({ force: true }));

  it('creates a new user with first and last names', (done) => {
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

  it('validates that an error is thrown if all fields are not filled', (done) => {
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.invalidUser)
      .expect(400)
      .end(function (err, res) {
        expect(res.body[0].message).to.equals('firstName cannot be null');
        done();
      });
  });

  it('validates that a new user must provide unique details', (done) => {
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

  it('validates that each new user has a role assigned', function (done) {
    request(app)
      .get('/users/1')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.validUser).to.have.property('roleId');
        if (err) return done(err);
        done();
      });
  });

  it('validates that all Users are accessible only when requested by admin', (done) => {
    request(app)
      .get('/users')
      .set('Authorization', adminToken)
      .expect(200)
      .end(function (err, res) {
        expect((res.body.users).length).to.equals(1);
        if (err) return done(err);
        done();
      });
  });

  it('validates that all users are not accessible to non-admins', (done) => {
    request(app)
      .get('/users')
      .expect(401)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Please Login!');
        if (err) return done(err);
        done();
      });
  });

  it('validates login for the user created', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'jane_doe@gmail.com',
        password: 'sequel'
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Welcome to the Document Management System');
        if (err) return done(err);
        done();
      });
  });

  it('a user that does not exist can not login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'peterJones@gmail.com',
        password: 'peterJones'
      })
      .expect(404)
      .end(function (err, res) {
        expect(res.body.message).to.equal('This record does not exists!');
        if (err) return done(err);
        done();
      });
  });

  it('ensure invalid user password can not access login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'jane_doe@gmail.com',
        password: 'seqlize'
      })
      .expect(401)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Invalid Password!');
        if (err) return done(err);
        done();
      });
  });

  it('a user that does not exist can not login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'peterJones@gmail.com',
        password: 'peterJones'
      })
      .expect(404)
      .end(function (err, res) {
        expect(res.body.message).to.equal('This record does not exists!');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that a authenticated user can logout', (done) => {
    request(app)
      .post('/users/logout')
      .set('Authorization', adminToken)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Logged out successfully!');
        if (err) return done(err);
        done();
      });
  });

  it('validates that a user can update the first and last name fields', (done) => {
    request(app)
      .put('/users/1')
      .send({
        firstName: 'chicken',
        lastName: 'michelin'
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Successfully Updated');
        if (err) return done(err);
        done();
      });
  });

  it('validates that a user can not update a user record that does not exist', (done) => {
    request(app)
      .put('/users/50')
      .send({
        firstName: 'chicken',
        lastName: 'michelin'
      })
      .expect(404)
      .end(function (err, res) {
        expect(res.body.message).to.equals('This record does not exists!');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that an existing user can be deleted', (done) => {
    request(app)
      .delete('/users/1')
      .set('Authorization', adminToken)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Successfully Deleted');
        if (err) return done(err);
        done();
      });
  });

  it('a user can only be deleted if the record exists', (done) => {
    request(app)
      .delete('/users/50')
      .set('Authorization', adminToken)
      .expect(404)
      .end(function (err, res) {
        expect(res.body.message).to.equal('This record was not deleted!');
        if (err) return done(err);
        done();
      });
  });
});
