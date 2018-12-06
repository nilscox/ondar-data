module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sketch', 'humoristId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'humorist', key: 'id' },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sketch', 'humoristId');
  },

};
