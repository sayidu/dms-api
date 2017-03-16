'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'userState', {type: Sequelize.BOOLEAN, allowNull:false});
  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Users', 'userState');
  }
};
