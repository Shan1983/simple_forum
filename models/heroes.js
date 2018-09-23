'use strict';
module.exports = (sequelize, DataTypes) => {
  const heroes = sequelize.define('heroes', {
    name: DataTypes.STRING,
    level: DataTypes.INTEGER,
    maxLevel: DataTypes.INTEGER
  }, {});
  heroes.associate = function(models) {
    // associations can be defined here
  };
  return heroes;
};