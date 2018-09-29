"use strict";
module.exports = (sequelize, DataTypes) => {
  const PollResponse = sequelize.define(
    "PollResponse",
    {
      response: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 240],
            msg: "The poll's response must be between 1 and 240 characters."
          },
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError("The response must be a string.");
            }
          }
        }
      },
      PollQueryId: DataTypes.INTEGER
    },
    {}
  );
  PollResponse.associate = function(models) {
    PollResponse.hasMany(mdoels.PollBallot);
  };
  return PollResponse;
};
