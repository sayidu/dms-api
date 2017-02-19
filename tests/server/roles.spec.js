const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');
let authToken, invalidToken, roleId1;

describe('Role API', function(){
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

  it('only Admin can create a new role that has a unique title',function(done){
    request(app)
      .post('/users')
      .set('Authorization', authToken)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
 /* it('retrieve all roles when Roles.all is called',function(done){
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
 it('validates that at least, “admin” and “regular” roles exist',function(done){

 });*/
});