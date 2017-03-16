'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let adminRoleId, regRoleId, adminToken, regToken;

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

  after(() => models.User.sequelize.sync({
    force: true
  }));

  it('creates a new admin user with first and last names', (done) => {
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.firstUser)
      .expect(201)
      .end((err, res) => {
        adminToken = res.body.token;
        expect(res.body.token).to.exist;
        expect(res.body.userInfo).to.have.property('firstName');
        expect(res.body.userInfo).to.have.property('lastName');
        expect(res.body.userInfo.userState).to.equal(true);
        if (err) return done(err);
        done();
      });
  });

  it('creates a new regular user with first and last names', (done) => {
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.secondUser)
      .expect(201)
      .end((err, res) => {
        regToken = res.body.token;
        expect(res.body.token).to.exist;
        expect(res.body.userInfo).to.have.property('firstName');
        expect(res.body.userInfo).to.have.property('lastName');
        expect(res.body.userInfo.userState).to.equal(true);
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
      .end((err, res) => {
        expect(res.body[0].message).to.equal('firstName cannot be null');
        done();
      });
  });

  it('validates that a new user must provide unique details', (done) => {
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.firstUser)
      .expect(409)
      .end((err, res) => {
        expect(res.body.message).to.equal('A user with this email already exists!');
        if (err) return done(err);
        done();
      });
  });

  it('validates that each new user has a role assigned', function (done) {
    request(app)
      .get('/users/1')
      .set('Content-Type', 'application/json')
      .set('Authorization', adminToken)
      .expect(200)
      .end((err, res) => {
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
      .end((err, res) => {
        expect((res.body.users).length).to.equal(2);
        if (err) return done(err);
        done();
      });
  });

  it('validates that all users are not accessible to non-admins', (done) => {
    request(app)
      .get('/users')
      .set('Authorization', regToken)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Unauthorised User');
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
      .end((err, res) => {
        adminToken = res.body.token;
        expect(res.body.message).to.equal('Welcome to the Document Management System');
        if (err) return done(err);
        done();
      });
  });

  it('a user that does not exist cannot login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'peterJones@gmail.com',
        password: 'peterJones'
      })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('This record does not exists!');
        if (err) return done(err);
        done();
      });
  });

  it('ensure users with invalid password cannot login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'jane_doe@gmail.com',
        password: 'seqlize'
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('Invalid Password!');
        if (err) return done(err);
        done();
      });
  });

  it('a user that does not exist cannot login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: 'peterJones@gmail.com',
        password: 'peterJones'
      })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('This record does not exists!');
        if (err) return done(err);
        done();
      });
  });

  it('validates that a user can update the first and last name fields', (done) => {
    request(app)
      .put('/users/1')
      .set('Authorization', adminToken)
      .send({
        firstName: 'chicken',
        lastName: 'michelin'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Successfully Updated');
        if (err) return done(err);
        done();
      });
  });

  it('validates that a user cannot update a user record that does not exist', (done) => {
    request(app)
      .put('/users/50')
      .set('Authorization', adminToken)
      .send({
        firstName: 'chicken',
        lastName: 'michelin'
      })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('This record does not exists!');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that an existing user can be deleted', (done) => {
    request(app)
      .delete('/users/2')
      .set('Authorization', adminToken)
      .expect(200)
      .end((err, res) => {
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
      .end((err, res) => {
        expect(res.body.message).to.equal('This record was not deleted!');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that a authenticated user can logout', (done) => {
    request(app)
      .post('/users/logout')
      .set('Authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Logged out successfully!');
        if (err) return done(err);
        done();
      });
  });

  it('Test that users are directed to the homepage on request', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to our Document Management System.');
        done();
      });
  });

    it('Test that users are directed to the homepage on invalid route request', (done) => {
    request(app)
      .get('/abds')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to our Document Management System.');
        done();
      });
  });
});