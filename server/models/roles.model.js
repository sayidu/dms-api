'use strict'

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
     title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    classMethods: {
      associate: models => {
        Role.hasMany(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Role;
}