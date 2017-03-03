module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access: {
      type: DataTypes.STRING,
      defaultValue: 'public',
      allowNull: false,
      validate: {
        isIn: [
          ['public', 'private', 'role'],
        ],
      },
    },
    ownerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    classMethods: {
      associate(models) {
        Document.belongsTo(models.User, {
          as: 'owner',
          foreignKey: {
            allowNull: false,
          },
          onDelete: 'CASCADE',
        });
      },
    },
  });
  return Document;
};
