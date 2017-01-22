//only an admin user can

import request from 'supertest';
import express from 'express';
const app = express();

describe('Role API', function(){
  it('create a new role that has a unique title',function(done){
    request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('retrieve all roles when Roles.all is called',function(done){
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

 });
});