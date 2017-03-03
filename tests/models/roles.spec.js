'use strict';

const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');

describe("Model for Role Table", () => {
 after(() => models.Role.sequelize.sync({ force: true }));

  it('creates a new role', (done) => {
    models.Role.create(fakeData.adminRole)
      .then((role) => {
        expect(role.dataValues.id).to.exist;
        expect('admin').to.equals(role.dataValues.roleTitle);
        expect(role.dataValues.createdAt).to.exist;
        done();
      })
      .catch((err) => {
        done();
      });
  });
  it('roleTitle must be unique', (done) => {
    models.Role.create(fakeData.adminRole)
      .then((role) => {
        done();
      })
      .catch((err) => {
        expect(err.errors[0].message).to.equals('roleTitle must be unique');
        expect(err.message).to.equals('Validation error');
        done();
      });
  });
  it('roleTitle must be defined', (done) => {
    models.Role.create(fakeData.invalidRole)
      .then((role) => {
        done();
      })
      .catch((err) => {
        expect(err.name).to.equals('SequelizeValidationError');
        expect(err.errors[0].message).to.equals('roleTitle cannot be null');
        done();
      });
  });
});