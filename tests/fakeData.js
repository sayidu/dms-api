const faker = require('faker');

module.exports = {
  adminRole: {
    roleTitle : 'admin'
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
  firstUser: {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    RoleId: 1
  },
  secondUser: {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    RoleId: 2
  },
  thirdUser: {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    RoleId: 2
  },
  document1: {
    title: faker.name.jobTitle(),
    content:faker.name.jobTitle(),
    access: 'public',
    ownerId: 1
  },
  document2 :{
    title: faker.name.jobTitle(),
    content:faker.name.jobTitle(),
    ownerId: 1
  },
   document3 :{
    title: faker.name.jobTitle(),
    content:faker.name.jobTitle(),
    access: 'private',
    ownerId: 2
  },
}