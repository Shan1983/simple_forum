'use strict';
module.exports = (sequelize, DataTypes) => {
  const pollBallot = sequelize.define('pollBallot', {
    UserId: DataTypes.INTEGER,
    PollQueryId: DataTypes.INTEGER,
    PollResponseId: DataTypes.INTEGER
  }, {});
  pollBallot.associate = function(models) {
    // associations can be defined here
  };
  return pollBallot;
};