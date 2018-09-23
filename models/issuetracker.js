'use strict';
module.exports = (sequelize, DataTypes) => {
  const issuetracker = sequelize.define('issuetracker', {
    issue: DataTypes.STRING,
    severity: DataTypes.ENUM,
    notes: DataTypes.TEXT,
    PriorityId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  issuetracker.associate = function(models) {
    // associations can be defined here
  };
  return issuetracker;
};