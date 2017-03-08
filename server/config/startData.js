const models = require('../../server/models');

models.Role.create({
    roleTitle: 'admin'
  })
  .then((role) => {
    console.log('Default Admin role created');
    models.User.create({
      username: 'j_teele',
      firstName: 'Jemima',
      lastName: 'Teele',
      email: 'jemima_teele@gmail.com',
      password: 'password',
      roleId: 1,
      userState: true
    }).then(() => {
      console.log('Default User role created');
      models.Role.create({
        roleTitle: 'regular'
      })
      .then((role) => {
        console.log('Default Regular role created');
      })
    });
  });
