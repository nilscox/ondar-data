module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('humorist', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      fullname: {
        type: Sequelize.STRING,
      },
      bio: {
        type: Sequelize.TEXT,
      },
      birthdate: {
        type: Sequelize.STRING,
      },
      roles: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      image: {
        type: Sequelize.STRING,
      },
      imageAlt: {
        type: Sequelize.STRING,
      },
      wikaUrl: {
        type: Sequelize.STRING,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('humorist');
  },

};
