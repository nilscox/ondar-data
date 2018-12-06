'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('humorist', 'roles');
  },

  down: (queryInterface, Sequelize) => {
  }
};
