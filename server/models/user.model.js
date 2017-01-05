'use strict'

const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: models => {
         User.belongsTo(models.Role, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        User.hasMany(models.Document, {
          onDelete: "CASCADE",
          foreignKey: {
            name: 'ownerId',
            allowNull: false
          }
        });
      }
    },
    hooks: {
       beforeCreate: (userPwd) => {
           userPwd.password =  bcrypt.hashSync(password, bcrypt.genSaltSync(8));
       },
       beforeUpdate: (userPwd) => {
           userPwd.password =  bcrypt.hashSync(password, bcrypt.genSaltSync(8));
       }
    }
  });

  return User;
}