'use strict';
module.exports = (sequelize, DataTypes) => {
  const issuePriority = sequelize.define('issuePriority', {
    response: DataTypes.STRING,
    IssueId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  issuePriority.associate = function(models) {
    // associations can be defined here
  };
  return issuePriority;
};