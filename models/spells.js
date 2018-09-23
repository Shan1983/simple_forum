'use strict';
module.exports = (sequelize, DataTypes) => {
  const spells = sequelize.define('spells', {
    name: DataTypes.STRING,
    level: DataTypes.INTEGER,
    maxLevel: DataTypes.INTEGER
  }, {});
  spells.associate = function(models) {
    // associations can be defined here
  };
  return spells;
};