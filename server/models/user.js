'use strict';

import bCrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate(models) {
        User.belongsTo(models.Role, {
          as: 'role',
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        User.hasMany(models.Document, {
          foreignKey: {
            name: 'ownerId',
            allowNull: false
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
    },
    instanceMethods: {
      validatePwd(password) {
        return bCrypt.compareSync(password, this.password);
      }
    }
  });
  return User;
};