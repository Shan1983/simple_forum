"use strict";
module.exports = (sequelize, DataTypes) => {
  const PollVote = sequelize.define(
    "PollVote",
    {
      UserId: DataTypes.INTEGER,
      PollQuestionId: DataTypes.INTEGER,
      PollResponseId: DataTypes.INTEGER
    },
    {}
  );
  PollVote.associate = function(models) {
    PollVote.belongsTo(models.User);
    PollVote.belongsTo(models.PollResponse);
    PollVote.belongsTo(models.PollQuestion);
  };
  return PollVote;
};
