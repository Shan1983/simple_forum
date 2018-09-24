'use strict';
module.exports = (sequelize, DataTypes) => {
  const rewards = sequelize.define('rewards', {
    pointsPerPost: DataTypes.INTEGER,
    pointsPerThread: DataTypes.INTEGER,
    pointsPerLike: DataTypes.INTEGER,
    pointsPerBestPost: DataTypes.INTEGER,
    pointsForAdvertising: DataTypes.INTEGER,
    pointsPerPollQuery: DataTypes.INTEGER,
    pointsPerPollBallot: DataTypes.INTEGER
  }, {});
  rewards.associate = function(models) {
    // associations can be defined here
  };
  return rewards;
};