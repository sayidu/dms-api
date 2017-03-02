'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const _ = require('lodash');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let authToken, regularToken, roleId1, roleId2;

describe('Role API', (done) => {
  before((done) => {
    models.Role.create(fakeData.adminRole)
      .then((roleData) => {
        roleId1 = roleData.dataValues.id;
        fakeData.firstUser.roleId = roleId1;
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

    models.Role.create(fakeData.regularRole)
      .then((roleData) => {
        roleId2 = roleData.dataValues.id;
        fakeData.secondUser.roleId = roleId2;
        request(app)
          .post('/users')
          .set('Content-Type', 'application/json')
          .send(fakeData.secondUser)
          .end(function (err, res) {
            fakeData.document2.ownerId = res.body.userInfo.id;
            regularToken = res.body.token;
            if (err) return done(err);
            done();
          });
      });
  });

  after(() => models.Role.sequelize.sync({ force: true }));

  it('Admin can create a new role that has a unique title', (done) => {
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

  it('Admin can create a new role that does not title', (done) => {
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

  it('Non-admin can not create a new role that has a unique title', (done) => {
    request(app)
      .post('/roles')
      .set('Authorization', regularToken)
      .send(fakeData.testRole1)
      .expect(403)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Unauthorised User');
        if (err) return done(err);
        done();
      });
  });

  it('retrieve all roles when Roles.all is called by an admin', (done) => {
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

  it('roles can not be viewed by regular users', (done) => {
    request(app)
      .get('/roles')
      .set('Authorization', regularToken)
      .expect(403)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Unauthorised User');
        if (err) return done(err);
        done();
      });
  });

  it('validates that at least, “admin” and “regular” roles exist', (done) => {
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
  it('ensures that a non admin role can be updated', (done) => {
    request(app)
      .put(`/roles/${roleId2}`)
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Sucessfully Updated');
        expect(res.body.updatedRole.roleTitle).to.equal('reviewer');
        if (err) return done(err);
        done();
      });
  });
  it('ensures that a admin role can not be updated', (done) => {
    request(app)
      .put(`/roles/${roleId1}`)
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(401)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Admin roleTitle can not be updated');
        if (err) return done(err);
        done();
      });
  });
  it('provided feedback for a role that can not be updated', (done) => {
   request(app)
      .put('/roles/10')
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(404)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Role with id: 10 not found');
        if (err) return done(err);
        done();
      });
  });
  it('ensures that a non admin role can be deleted', (done) => {
    request(app)
      .delete(`/roles/${roleId2}`)
      .set('Authorization', authToken)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Successfully Deleted');
        if (err) return done(err);
        done();
      });
  });
   it('provided feedback for a role that can not be deleted', (done) => {
   request(app)
      .delete('/roles/10')
      .set('Authorization', authToken)
      .expect(404)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Role with id: 10 not found');
        if (err) return done(err);
        done();
      });
  });
  it('ensures that a admin role can not be deleted', (done) => {
    request(app)
      .delete(`/roles/${roleId1}`)
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(401)
      .end(function (err, res) {
        expect(res.body.message).to.equal('Admin can not be deleted');
        if (err) return done(err);
        done();
      });
  });
});
