module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sketch', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      number: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      total: {
        type: Sequelize.INTEGER,
      },
      totalyt: {
        type: Sequelize.INTEGER,
      },
      category: {
        type: Sequelize.STRING,
      },
      wikaUrl: {
        type: Sequelize.STRING,
      },
      youtubeUrl: {
        type: Sequelize.STRING,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sketch');
  },

};
