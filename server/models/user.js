const bCrypt = require('bcrypt');

'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        User.belongsTo(models.Role, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        User.hasMany(models.Document, {
           foreignKey: {
            name: 'ownerId',
            allowNull: false,
          },
          onDelete: 'CASCADE'
        });
      }
    },
    hooks: {
      beforeCreate: (validUser) => {
        validUser.password = bCrypt.hashSync(validUser.password,
          bCrypt.genSaltSync(8));
      },
      beforeUpdate: (validUser) => {
        validUser.password = bCrypt.hashSync(validUser.password,
          bCrypt.genSaltSync(8));
      }
    }
  });
  return User;
};