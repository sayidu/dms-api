'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
const new_user = fakeData.firstUser;
let authToken;

describe('Middleware Authentication Tests', () => {
  before((done) => {
    models.Role.create(fakeData.adminRole)
      .then((adminRole) => {
        fakeData.firstUser.roleId = adminRole.dataValues.id;
        models.User.create(new_user)
          .then(() => {
            request(app)
              .post('/users/login')
              .send({
                email: new_user.email,
                password: new_user.password
              })
              .end((err, res) => {
                authToken = res.body.token;
                done();
              });
          });
      })
  });

  after(() => models.User.sequelize.sync({
    force: true
  }));

  it('grant access request for users with valid token', (done) => {
    request(app)
      .get('/users')
      .set('Authorization', authToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect((res.body.users).length).to.equal(1);
        done();
      });
  });

  it('should return unauthorised for access request without a token', (done) => {
    request(app)
      .get('/users')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Please Login!');
        done();
      });
  });

  it('deny access request for users with invalid token', (done) => {
    const randomTokenString = 'adsddsdsdfdsf';
    request(app)
      .get('/users')
      .set('Authorization', randomTokenString)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Invalid Authentication Details');
        done();
      });
  });

  it('Logout should blacklist the active token', (done) => {
    request(app)
      .post('/users/logout')
      .set('Authorization', authToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Logged out successfully!');
        if (err) return done(err);
        done();
      });
  });

  it('a token is blacklisted and cannot be used for access after logout', (done) => {
    request(app)
      .get('/users')
      .set('Authorization', authToken)
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('Please Login!');
        if (err) return done(err);
        done();
      });
  });
});