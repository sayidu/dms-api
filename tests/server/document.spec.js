'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let authToken, regularToken, testerToken, adminRoleId, regRoleId;

describe('Document API', () => {
  before((done) => {
    models.Role.create(fakeData.adminRole)
      .then((roleData) => {
        adminRoleId = roleData.dataValues.id;
        fakeData.firstUser.roleId = adminRoleId;
        request(app)
          .post('/users')
          .set('Content-Type', 'application/json')
          .send(fakeData.firstUser)
          .end((err, res) => {
            fakeData.document1.ownerId = res.body.userInfo.id;
            authToken = res.body.token;
          });
      });

    models.Role.create(fakeData.regularRole)
      .then((roleData) => {
        regRoleId = roleData.dataValues.id;
        fakeData.secondUser.roleId = regRoleId;
        request(app)
          .post('/users')
          .set('Content-Type', 'application/json')
          .send(fakeData.secondUser)
          .end((err, res) => {
            fakeData.document2.ownerId = res.body.userInfo.id;
            fakeData.document3.ownerId = res.body.userInfo.id;
            regularToken = res.body.token;
            models.Document.bulkCreate(fakeData.bulkDocuments);
          });
      });

    models.Role.create(fakeData.testRole)
      .then((roleData) => {
        request(app)
          .post('/users')
          .set('Content-Type', 'application/json')
          .send(fakeData.thirdUser)
          .end((err, res) => {
            testerToken = res.body.token;
            done();
          });
      });
  });

after(() => models.Document.sequelize.sync({ force: true }));

  it('validates that a new User Document created has a published date defined', (done) => {
    request(app)
      .post('/documents')
      .set('Authorization', authToken)
      .send(fakeData.document1)
      .expect(201)
      .end((err, res) => {
        expect(res.body.doc).to.have.property('createdAt');
        expect(res.body.message).to.equal('Document Created');
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
      .end((err, res) => {
        expect(res.body.doc.access).to.equal('public');
        expect(res.body.doc).to.have.property('access');
        expect(res.body.message).to.equal('Document Created');
        if (err) return done(err);
        done();
      });
  });

  it('validates that a user can update title and content details for their document', (done) => {
    request(app)
      .put('/documents/1')
      .set('Authorization', authToken)
      .send({
        title: 'The Right Database',
        content: 'This content is required'
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('Your doc has been updated');
        if (err) return done(err);
        done();
      });
  });

  it('validate creation of private documents', (done) => {
    request(app)
      .post('/documents')
      .set('Authorization', regularToken)
      .send(fakeData.document3)
      .expect(201)
      .end((err, res) => {
        expect(res.body.doc.access).to.equal('private');
        expect(res.body.message).to.equal('Document Created');
        if (err) return done(err);
        done();
      });
  });

  it('validates ONLY the creator of a document can retrieve a file with “\access\” set as “\private\”', (done) => {
    request(app)
      .get('/documents/38')
      .set('Authorization', testerToken)
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.have.equal('Unauthorised to view this document');
        if (err) return done(err);
        done();
      });
  });

  it('validates the creator of a document can access it even when the doc is private', (done) => {
    request(app)
      .get('/documents/38')
      .set('Authorization', regularToken)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message.id).to.have.equal(38);
        expect(res.body.message).to.have.property('access');
        if (err) return done(err);
        done();
      });
  });

  it('creates a document with access set to role', (done) => {
    fakeData.document4.ownerId = regRoleId;
    request(app)
      .post('/documents')
      .set('Authorization', regularToken)
      .send(fakeData.document4)
      .expect(201)
      .end((err, res) => {
        expect(res.body.doc.access).to.equal('role');
        expect(res.body.message).to.equal('Document Created');
        if (err) return done(err);
        done();
      });
  });

  it('users with the same role can access the document', (done) => {
    request(app)
      .get('/documents/40')
      .set('Authorization', regularToken)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('A document was found');
        expect(res.body.doc.access).to.equal('role');
        if (err) return done(err);
        done();
      });
  });

  it('only users with the same role can access the document', (done) => {
    request(app)
      .get('/documents/40')
      .set('Authorization', testerToken)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Unauthorised to view this document');
        if (err) return done(err);
        done();
      });
  });

  it('validates that all documents are returned in order of their published dates', (done) => {
    request(app)
      .get('/documents')
      .set('Authorization', authToken)
      .expect(201)
      .end((err, res) => {
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
      .end((err, res) => {
        expect((res.body.docs).length).to.equal(5);
        if (err) return done(err);
        done();
      });
  });

  it('validates that offset and limit applied when fetching all the pages', (done) => {
    request(app)
      .get('/documents?limit=10&offset=2')
      .set('Authorization', authToken)
      .expect(201)
      .end((err, res) => {
        expect(res.body.docs[1].id).to.exist;
        expect((res.body.docs).length).to.equal(10);
        if (err) return done(err);
        done();
      });
  });

  it('validates that if a user is an admin all documents are made available', (done) => {
    request(app)
      .get('/documents')
      .set('Authorization', authToken)
      .expect(201)
      .end((err, res) => {
        expect((res.body.docs).length).to.be.greaterThan(11);
        if (err) return done(err);
        done();
      });
  });

  it('ensures that an existing document can be deleted', (done) => {
    request(app)
      .delete('/documents/5')
      .set('Authorization', authToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('The Document was deleted');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that an existing document can not be deleted', (done) => {
    request(app)
      .delete('/documents/60')
      .set('Authorization', authToken)
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('This record was not deleted!');
        if (err) return done(err);
        done();
      });
  });

   it('ensures that a user can search authorised documents with keywords', (done) => {
    request(app)
      .get('/search?searchText=a')
      .set('Authorization', authToken)
      .expect(201)
      .end((err, res) => {
        expect((res.body.docs).length).to.be.greaterThan(0);
        if (err) return done(err);
        done();
      });
  });
});
