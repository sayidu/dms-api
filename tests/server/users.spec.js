import request from 'supertest';
import express from 'express';
const app = express();

describe('User API', function(){
  it('validates a new user is unique',function(done){
    request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('validates that when users are returned only when requested by admin',function(done){
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
 it('validates that a new user created has both first and last names',function(done){

 });
 it('validates that a new user created has a role defined.',function(done){

  });
});