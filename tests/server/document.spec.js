/*

a test suite called `Document`.
Write a test that validates that a new user document created has a published date defined.
Write a test that validates a document has a property “access” set as “public” by default.
Write a test that validates ONLY the creator of a document can retrieve a file with “access” set as “private”
Write a test that validates ONLY user’s with the same role as the creator, can access documents with property “access” set to “role”.
Write a test that validates that all documents are returned, limited by a specified number, when Documents.all is called with a query parameter limit. All documents should only include:
Documents marked as public
Documents that have role level access i.e created by a user with the same role level
Documents created by the logged in user
If user is admin, then all available documents
Write a test that also employs the limit above with an offset as well (pagination). So documents could be fetched in chunks e.g 1st 10 document, next 10 documents (skipping the 1st 10) and so on.
Write a test that validates that all documents are returned in order of their published dates, starting from the most recent when Documents.all is called
*/

import request from 'supertest';
const express = require('express');
const chai = require('chai');

describe( 'Document API', function(){
  it('',function(done){

  })
});