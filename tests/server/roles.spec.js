'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const _ = require('lodash');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let authToken, regularToken, adminRoleId, regRoleId;

describe('Role API', (done) => {
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
      })

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
            regularToken = res.body.token;
            done();
          });
      });
  });

  after(() => models.Role.sequelize.sync({
    force: true
  }));

  it('an admin can create a new role which has a unique title', (done) => {
    request(app)
      .post('/roles')
      .set('Authorization', authToken)
      .send(fakeData.testRole)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('New Role Created');
        if (err) return done(err);
        done();
      });
  });

  it('an admin cannot create a new role without a role title', (done) => {
    request(app)
      .post('/roles')
      .set('Authorization', authToken)
      .send(fakeData.testRole)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('Roles require unique titles.');
        if (err) return done(err);
        done();
      });
  });

  it('a non-admin cannot create a new role', (done) => {
    request(app)
      .post('/roles')
      .set('Authorization', regularToken)
      .send(fakeData.testRole1)
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('Unauthorised User');
        if (err) return done(err);
        done();
      });
  });

  it('retrieve all roles when Roles.all is called by an admin', (done) => {
    request(app)
      .get('/roles')
      .set('Authorization', authToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Roles Found');
        expect((res.body.roles).length).to.equal(3);
        if (err) return done(err);
        done();
      });
  });

  it('roles cannot be viewed by regular users', (done) => {
    request(app)
      .get('/roles')
      .set('Authorization', regularToken)
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('Unauthorised User');
        if (err) return done(err);
        done();
      });
  });

  it('validates that at least, “admin” and “regular” roles exist', (done) => {
    request(app)
      .get('/roles')
      .set('Authorization', authToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Roles Found');
        expect(res.body.roles[0].roleTitle).to.equal('admin');
        expect(res.body.roles[1].roleTitle).to.equal('regular');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that a non-admin role can be updated', (done) => {
    request(app)
      .put(`/roles/${regRoleId}`)
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('Sucessfully Updated');
        expect(res.body.updatedRole.roleTitle).to.equal('reviewer');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that an admin role cannot be updated', (done) => {
    request(app)
      .put(`/roles/${adminRoleId}`)
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Admin roleTitle cannot be updated');
        if (err) return done(err);
        done();
      });
  });

  it('provide feedback for a role that cannot be updated', (done) => {
    request(app)
      .put('/roles/10')
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('Role with id: 10 not found');
        if (err) return done(err);
        done();
      });
  });

  it('ensures a non-admin cannot update a role', (done) => {
    request(app)
      .put(`/roles/${regRoleId}`)
      .set('Authorization', regularToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('Unauthorised User');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that a non-admin role can be deleted', (done) => {
    request(app)
      .delete(`/roles/${regRoleId}`)
      .set('Authorization', authToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Successfully Deleted');
        if (err) return done(err);
        done();
      });
  });

  it('provides feedback for a role that cannot be deleted', (done) => {
    request(app)
      .delete('/roles/10')
      .set('Authorization', authToken)
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('Role with id: 10 not found');
        if (err) return done(err);
        done();
      });
  });

  it('ensures that a admin role cannot be deleted', (done) => {
    request(app)
      .delete(`/roles/${adminRoleId}`)
      .set('Authorization', authToken)
      .send({
        roleTitle: 'reviewer'
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Admin cannot be deleted');
        if (err) return done(err);
        done();
      });
  });
});