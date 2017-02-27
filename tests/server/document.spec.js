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
      //regularRole created, creates document 2
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
            fakeData.document3.ownerId = res.body.userInfo.id;
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

  it('validates that a new User Document created has a published date defined', (done) => {
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

  it('validates a document has a property “access” set as “public” by default.', (done) => {
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

  it('only document with all the required fields: title, content, ownerId are created', (done) => {
    request(app)
      .post('/documents')
      .set('Authorization', invalidToken)
      .send(fakeData.invalidDoc)
      .expect(400)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Please complete all required fields');
        if (err) return done(err);
        done();
      });
  });

   it('validates that a user can update title and content details for their document', (done) => {
    request(app)
      .put('/documents/1')
      .set('Authorization', authToken)
      .send({title: 'The Right Database'})
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Your doc has been updated');
        if (err) return done(err);
        done();
      });
  });

 it('validate creation of private documents', (done) => {
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

  it('validates ONLY the creator of a document can retrieve a file with “\access\” set as “\private\”', (done) => {
    request(app)
      .get('/documents/38')
      .set('Authorization', thirdToken)
      .expect(401)
      .end(function (err, res) {
        expect(res.body.message).to.have.equals('Unauthorised to view this document');
        if (err) return done(err);
        done();
      });
  });

  it('validates the creator of a document can access it even when the doc is private ', (done) => {
    request(app)
      .get('/documents/38')
      .set('Authorization', invalidToken)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message.id).to.have.equals(38);
        expect(res.body.message).to.have.property('access');
        if (err) return done(err);
        done();
      });
  });

  it('creates a document with access set to role', (done) => {
    fakeData.document4.ownerId = roleId2;
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

  it('only users with the same role can access the document', (done) => {
    request(app)
      .get('/documents/40')
      .set('Authorization', thirdToken)
      .expect(403)
      .end(function (err, res) {
        expect(res.body.message).to.equals('Unauthorised to view this document');
        if (err) return done(err);
        done();
      });
  });

  it('validates that all documents are returned in order of their published dates', (done) => {
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

  it('validates that offset is applied when fetching all the pages', (done) => {
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

  it('validates that offset and limit applied when fetching all the pages', (done) => {
    request(app)
      .get('/documents?limit=10&offset=1')
      .set('Authorization', authToken)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.docs[1].id).to.exist;
        expect((res.body.docs).length).to.equals(10);
        if (err) return done(err);
        done();
      });
  });

  it('validates that if a user is an admin all documents are made available', (done) => {
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
