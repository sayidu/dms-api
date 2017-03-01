'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');


describe("Model for Document Table", () => {
  before(() => {
   return models.Role.create(fakeData.adminRole)
      .then((role) => {
        fakeData.firstUser.roleId = role.dataValues.id;
        return models.User.create(fakeData.firstUser)
      })
      .then((user) => {
        fakeData.document3.ownerId = user.dataValues.id;
      });
  });

after(() => models.Document.sequelize.sync({ force: true }));

  it('validates Document creation with valid details', (done) => {
    models.Document.create(fakeData.document3)
      .then((doc) => {
        expect('History').to.equals(doc.dataValues.title);
        expect('The history is made!!.').to.equals(doc.dataValues.content);
        expect('private').to.equals(doc.dataValues.access);
        expect(doc.dataValues.createdAt).to.exist;
        done();
      });
  });
  it('Documents are not with specified title', (done) => {
    models.Document.create(fakeData.invalidDoc)
      .then((doc) => {
        expect(doc).to.not.exist;
        done();
      })
      .catch((err) => {
        expect(err.name).to.equals('SequelizeValidationError');
        expect(err.errors[0].message).to.equals('title cannot be null');
        done();
      });
  });
  it('Documents with invalid access can not be created', (done) => {
    models.Document.create(fakeData.invalidDoc2)
      .then((doc) => {
        done();
      })
      .catch((err) => {
        expect(err.name).to.equals('SequelizeValidationError');
        expect(err.errors[0].message).to.equals('Validation isIn failed');
        done();
      });
  });
  it('verifies that documents can only be created by existing users', (done) => {
    fakeData.document4.ownerId = 5;
    models.Document.create(fakeData.document4)
      .then((doc) => {
        done();
      })
      .catch((err) => {
        expect(err.name).to.equals('SequelizeForeignKeyConstraintError');
        done();
      });
  });
});
