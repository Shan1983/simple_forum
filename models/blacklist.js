'use strict';
module.exports = (sequelize, DataTypes) => {
  const blacklist = sequelize.define('blacklist', {
    playerTag: DataTypes.STRING,
    currentName: DataTypes.STRING,
    previousName: DataTypes.STRING,
    reason: DataTypes.TEXT
  }, {});
  blacklist.associate = function(models) {
    // associations can be defined here
  };
  return blacklist;
};