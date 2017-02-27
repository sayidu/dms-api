'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const _ = require('lodash');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let authToken, invalidToken, roleId1, roleId2;

describe('Role API', function () {
  before((done) => {
    //Admin Created, Role ID, Creates Document 1
    models.Role.create(fakeData.adminRole)
      .then((roleData) => {
        roleId1 = roleData.dataValues.id;
        fakeData.firstUser.RoleId = roleId1;
        request(app)
          .post('/users')
          .set('Content-Type', 'application/json')
          .send(fakeData.firstUser)
          .end(function (err, res) {
            fakeData.document1.ownerId = res.body.userInfo.id;
            authToken = res.body.token;
            if (err) return done(err);
          });
      })
      //regularRole created, creates document 2
    models.Role.create(fakeData.regularRole)
      .then((roleData) => {
        roleId2 = roleData.dataValues.id;
        fakeData.secondUser.RoleId = roleId2;
        request(app)
          .post('/users')
          .set('Content-Type', 'application/json')
          .send(fakeData.secondUser)
          .end(function (err, res) {
            fakeData.document2.ownerId = res.body.userInfo.id;
            invalidToken = res.body.token;
            if (err) return done(err);
            done();
          });
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

  it('Admin can create a new role that has a unique title', function (done) {
    request(app)
      .post('/roles')
      .set('Authorization', authToken)
      .send(fakeData.testRole)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message).to.equals('New Role Created');
        if (err) return done(err);
        done();
      });
  });

  it('Admin can create a new role that does not title', function (done) {
    request(app)
      .post('/roles')
      .set('Authorization', authToken)
      .send(fakeData.testRole)
      .expect(400)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Roles require unique titles.');
        if (err) return done(err);
        done();
      });
  });

  it('Non-admin can not create a new role that has a unique title', function (done) {
    request(app)
      .post('/roles')
      .set('Authorization', invalidToken)
      .send(fakeData.testRole1)
      .expect(403)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Unauthorised User');
        if (err) return done(err);
        done();
      });
  });

  it('retrieve all roles when Roles.all is called', function (done) {
    request(app)
      .get('/roles')
      .set('Authorization', authToken)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Roles Found');
        expect((res.body.roles).length).to.equal(3);
        if (err) return done(err);
        done();
      });
  });

  it('validates that at least, “admin” and “regular” roles exist', function (done) {
    request(app)
      .get('/roles')
      .set('Authorization', authToken)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Roles Found');
        expect(res.body.roles[0].roleTitle).to.equal('admin');
        expect(res.body.roles[1].roleTitle).to.equal('regular');
        if (err) return done(err);
        done();
      });
  });
});