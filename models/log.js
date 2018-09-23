'use strict';
module.exports = (sequelize, DataTypes) => {
  const log = sequelize.define('log', {
    UserId: DataTypes.INTEGER,
    ThreadId: DataTypes.INTEGER,
    SessionId: DataTypes.INTEGER,
    resource: DataTypes.STRING,
    method: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {});
  log.associate = function(models) {
    // associations can be defined here
  };
  return log;
};