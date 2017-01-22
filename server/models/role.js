'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleTitle: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        Role.hasMany(models.User,{
           foreignKey: {
             allowNull: false,
           }
        });
      }
    }
  });
  return Role;
};