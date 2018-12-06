module.exports = (sequelize, DataTypes) => {

  const sketch = sequelize.define('sketch', {
    number: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    total: DataTypes.INTEGER,
    totalyt: DataTypes.INTEGER,
    category: DataTypes.STRING,
    wikaUrl: DataTypes.STRING,
    youtubeUrl: DataTypes.STRING,
  }, {
    tableName: 'sketch',
    timestamps: false,
  });

  sketch.associate = function(models) {
    sketch.belongsTo(models.Humorist);
  };

  return sketch;
};
