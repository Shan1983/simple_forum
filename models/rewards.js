"use strict";
module.exports = (sequelize, DataTypes) => {
  const Rewards = sequelize.define(
    "Rewards",
    {
      init: { type: DataTypes.BOOLEAN, defaultValue: false },
      pointsPerPost: DataTypes.INTEGER,
      pointsPerThread: DataTypes.INTEGER,
      pointsPerLike: DataTypes.INTEGER,
      pointsPerBestPost: DataTypes.INTEGER,
      pointsForAdvertising: DataTypes.INTEGER,
      pointsPerPollQuestion: DataTypes.INTEGER,
      pointsPerPollVote: DataTypes.INTEGER
    },
    {}
  );
  // Rewards.associate = function(models) {
  //   // associations can be defined here
  // };

  Rewards.initialSetup = async function() {
    await Rewards.create({
      pointsPerPost: 20,
      pointsPerThread: 20,
      pointsPerLike: 20,
      pointsPerBestPost: 50,
      pointsForAdvertising: 1000,
      pointsPerPollQuestion: 20,
      pointsPerPollVote: 20,
      init: true
    });
  };

  return Rewards;
};
