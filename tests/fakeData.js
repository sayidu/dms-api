const faker = require('faker');

module.exports = {
  adminRole: {
    roleTitle : 'admin'
  },
  regularRole: {
    roleTitle: 'regular'
  },
  firstUser: {
    id: 1,
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
    id: 2,
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    RoleId: 2
  }
}