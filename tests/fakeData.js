'use strict';

const faker = require('faker');

module.exports = {
  adminRole: {
    roleTitle: 'admin'
  },
  regularRole: {
    roleTitle: 'regular'
  },
  testRole: {
    roleTitle: 'tester'
  },
  testRole1: {
    roleTitle: 'failedTester'
  },
  invalidRole: {
  },
  firstUser: {
    username: 'jane_doe',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane_doe@gmail.com',
    password: 'sequel',
    roleId: 1,
    userState: true
  },
  secondUser: {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    roleId: 2,
    userState: true
  },
  thirdUser: {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    roleId: 3,
    userState: true
  },
  invalidUser: {
    username: faker.internet.userName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: 2,
    userState: true
  },
  invalidUser2: {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    roleId: 2,
    userState: true
  },
  document1: {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public'
  },
  document2: {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle()
  },
  document3: {
    id: 38,
    title: 'History',
    content: 'The history is made!!.',
    access: 'private',
    ownerId: 2
  },
  document4: {
    id: 40,
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'role',
    ownerId: 2
  },
  invalidDoc: {
    content: faker.name.jobTitle(),
    access: 'role',
    ownerId: 2
  },
  invalidDoc2: {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'bulkDoc',
    ownerId: 1
  },
  bulkDocuments: [{
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'private',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'role',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 1
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 1
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'private',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 1
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'private',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 1
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'private',
    ownerId: 2,
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'private',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'public',
    ownerId: 1
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'private',
    ownerId: 2
  }, {
    title: faker.name.jobTitle(),
    content: faker.name.jobTitle(),
    access: 'private',
    ownerId: 2
  }]
}
