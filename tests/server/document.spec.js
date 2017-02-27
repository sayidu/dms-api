'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let authToken, invalidToken, thirdToken, roleId1, roleId2;

//Creation of docs should use a token also./
describe('Document API', function () {
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
            models.Document.bulkCreate(fakeData.bulkDocuments);
            if (err) return done(err);
          });
      });

    models.Role.create(fakeData.testRole)
      .then((roleData) => {
        request(app)
          .post('/users')
          .set('Content-Type', 'application/json')
          .send(fakeData.thirdUser)
          .end(function (err, res) {
            thirdToken = res.body.token;
            done();
            if (err) return done(err);
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

  it('validates that a new User Document created has a published date defined', function (done) {
    request(app)
      .post('/documents')
      .set('Authorization', authToken)
      .send(fakeData.document1)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.doc).to.have.property('createdAt');
        expect(res.body.message).to.equals('Document Created');
        if (err) return done(err);
        done();
      });
  });

  it('validates a document has a property “access” set as “public” by default.', function (done) {
    request(app)
      .post('/documents')
      .set('Authorization', authToken)
      .send(fakeData.document2)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.doc.access).to.equals('public');
        expect(res.body.doc).to.have.property('access');
        expect(res.body.message).to.equals('Document Created');
        if (err) return done(err);
        done();
      });
  });

  it('validate creation of private documents', function (done) {
    request(app)
      .post('/documents')
      .set('Authorization', invalidToken)
      .send(fakeData.document3)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.doc.access).to.equals('private');
        expect(res.body.doc).to.have.property('access');
        expect(res.body.message).to.equals('Document Created');
        if (err) return done(err);
        done();
      });
  });

  it('validates ONLY the creator of a document can retrieve a file with “\access\” set as “\private\”', function (done) {
    request(app)
      .get('/documents/22')
      .set('Authorization', authToken)
      .expect(401)
      .end(function (err, res) {
        expect(res.body.message).to.have.equals('Unauthorised to view this document');
        if (err) return done(err);
        done();
      });
  });

  it('validates ONLY the creator of a document can retrieve a file with “\access\” set as “\private\”', function (done) {
    request(app)
      .get('/documents/22')
      .set('Authorization', invalidToken)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message.id).to.have.equals(22);
        expect(res.body.message).to.have.property('access');
        if (err) return done(err);
        done();
      });
  });

  it('creates a document with access set to role', function (done) {
    request(app)
      .post('/documents')
      .set('Authorization', invalidToken)
      .send(fakeData.document4)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.doc.access).to.equals('role');
        expect(res.body.doc).to.have.property('access');
        expect(res.body.message).to.equals('Document Created');
        if (err) return done(err);
        done();
      });
  });

  it('only users with the same role can access the document', function (done) {
    request(app)
      .get('/documents/23')
      .set('Authorization', thirdToken)
      .expect(403)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Unauthorised to view this document');
        if (err) return done(err);
        done();
      });
  });

  it('validates that all documents are returned in order of their published dates', function (done) {
    request(app)
      .get('/documents')
      .set('Authorization', authToken)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.docs[0].id).to.be.above(res.body.docs[1].id);
        expect(res.body.docs[0].createdAt).to.be.above(res.body.docs[1].createdAt);
        if (err) return done(err);
        done();
      });
  });

  it('validates that offset is applied when fetching all the pages', function (done) {
    request(app)
      .get('/documents?limit=5')
      .set('Authorization', authToken)
      .expect(201)
      .end(function (err, res) {
        expect((res.body.docs).length).to.equals(5);
        if (err) return done(err);
        done();
      });
  });
  it('validates that offset and limit applied when fetching all the pages', function (done) {
    request(app)
      .get('/documents?limit=10&offset=2')
      .set('Authorization', authToken)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.docs[5].id).to.exist;
        expect((res.body.docs).length).to.equals(10);
        if (err) return done(err);
        done();
      });
  });
  it('validates that if a user is an admin all documents are made available', function (done) {
    request(app)
      .get('/documents')
      .set('Authorization', authToken)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.docs[0].id).to.be.above(res.body.docs[1].id);
        expect(res.body.docs[0].createdAt).to.be.above(res.body.docs[1].createdAt);
        if (err) return done(err);
        done();
      });
  });
});

/*
Write a test that validates that all documents returned, given a search criteria, can be limited by a specified number,
ordered by published date and were created by a specified role.
Write a test that validates that all documents returned, can be limited by a specified number and were published on a certain date.

describe('Search', function () {

});*/