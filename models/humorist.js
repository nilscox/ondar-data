module.exports = (sequelize, DataTypes) => {

  const humorist = sequelize.define('humorist', {
    name: DataTypes.STRING,
    fullname: DataTypes.STRING,
    bio: DataTypes.TEXT,
    birthdate: DataTypes.DATE,
    image: DataTypes.STRING,
    imageAlt: DataTypes.STRING,
    wikaUrl: DataTypes.STRING,
  }, {
    tableName: 'humorist',
    timestamps: false,
  });

  humorist.associate = function(models) {
    humorist.hasMany(models.Sketch);
  };

  return humorist;
};
