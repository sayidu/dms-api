'use strict';

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        Document.belongsTo(models.User,{
          as: 'owner',
          foreignKey: {
            allowNull: false,
          },
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Document;
};