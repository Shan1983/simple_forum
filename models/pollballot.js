"use strict";
module.exports = (sequelize, DataTypes) => {
  const PollBallot = sequelize.define(
    "PollBallot",
    {
      UserId: DataTypes.INTEGER,
      PollQueryId: DataTypes.INTEGER,
      PollResponseId: DataTypes.INTEGER
    },
    {}
  );
  PollBallot.associate = function(models) {
    PollBallot.belongsTo(models.User);
    PollBallot.belongsTo(models.PollResponse);
    PollBallot.belongsTo(models.PollQuery);
  };
  return PollBallot;
};
