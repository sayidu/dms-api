'use strict'

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define("Document", {
    title: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.TEXT
    },
    access: {
      defaultValue: 'public',
      type: DataTypes.STRING,

    },
  }, {
    classMethods: {
      associate: models => {
        Document.belongsTo(models.User, {
          as: 'Owner',
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Document;
}