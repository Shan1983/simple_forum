"use strict";
module.exports = (sequelize, DataTypes) => {
  const Rewards = sequelize.define(
    "Rewards",
    {
      pointsPerPost: DataTypes.INTEGER,
      pointsPerThread: DataTypes.INTEGER,
      pointsPerLike: DataTypes.INTEGER,
      pointsPerBestPost: DataTypes.INTEGER,
      pointsForAdvertising: DataTypes.INTEGER,
      pointsPerPollQuery: DataTypes.INTEGER,
      pointsPerPollBallot: DataTypes.INTEGER
    },
    {}
  );
  // Rewards.associate = function(models) {
  //   // associations can be defined here
  // };
  return Rewards;
};
