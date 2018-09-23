'use strict';
module.exports = (sequelize, DataTypes) => {
  const troops = sequelize.define('troops', {
    name: DataTypes.STRING,
    level: DataTypes.INTEGER,
    maxLevel: DataTypes.INTEGER
  }, {});
  troops.associate = function(models) {
    // associations can be defined here
  };
  return troops;
};