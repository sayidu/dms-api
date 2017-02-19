const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');

describe(("Document Models"), function () {
    it(('it creates a private document'), function () {
     // return
      const doc = models.Document.build(fakeData.document3);
         /* .then((doc) => {
            console.log("Document Created", doc);
          });*/
    });
});