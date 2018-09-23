'use strict';
module.exports = (sequelize, DataTypes) => {
  const ban = sequelize.define('ban', {
    UserId: DataTypes.INTEGER,
    ipBanned: DataTypes.BOOLEAN,
    reason: DataTypes.TEXT
  }, {});
  ban.associate = function(models) {
    // associations can be defined here
  };
  return ban;
};