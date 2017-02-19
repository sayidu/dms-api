/*
Write a test that validates ONLY user’s with the same role as the creator, can access documents with property “access” set to “role”.
Write a test that validates that all documents are returned, limited by a specified number, when Documents.all is called with a query parameter limit.
All documents should only include:
Documents marked as public
Documents that have role level access i.e created by a user with the same role level
Documents created by the logged in user
If user is admin, then all available documents
Write a test that also employs the limit above with an offset as well (pagination). So documents could be fetched in chunks e.g 1st 10 document, next 10 documents (skipping the 1st 10) and so on.
Write a test that validates that all documents are returned in order of their published dates, starting from the most recent when Documents.all is called
*/

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let authToken, invalidToken, roleId1;

//Creation of docs should use a token also.

describe('Document API', function () {
  before((done) => {
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.firstUser)
      .end(function (err, res) {
        authToken = res.body.token;
        if (err) return done(err);
      });
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(fakeData.thirdUser)
      .end(function (err, res) {
        invalidToken = res.body.token;
        if (err) return done(err);
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
      .get('/documents/3')
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
      .get('/documents/3')
      .set('Authorization', invalidToken)
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message.id).to.have.equals(3);
        expect(res.body.message).to.have.property('access');
        if (err) return done(err);
        done();
      });
  });
  it('validates ONLY user\’s with the same role as the creator, can access documents with property access set to role.', function (done) {});
  it('validates that all documents are returned in order of their published dates, starting from the most recent when Documents.all is called', function (done) {

  });
});