"use strict";
const moment = require("moment");
const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const PollQuery = sequelize.define(
    "PollQuery",
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 240],
            msg: "The poll's question must be between 1 and 240 characters."
          },
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError(
                "Poll question must be a string."
              );
            }
          }
        }
      },
      UserId: { type: DataTypes.INTEGER },
      duration: { type: DataTypes.INTEGER, validate: { isInt: true } },
      completionDate: {
        type: DataTypes.DATE
      },
      isDone: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );

  // class methods
  PollQuery.associate = function(models) {
    PollQuery.belongsTo(models.User);
    PollQuery.hasMany(models.PollResponse);
    PollQuery.hasMany(models.PollBallot);
  };

  // instance methods

  // check if poll is finished
  PollQuery.prototype.checkIfFinished = async function(id) {
    const poll = await this.findOne({
      where: { id }
    });
    if (poll.isDone) {
      errors.parameterError("isDone", "This poll has finished");
    } else if (moment().isAfter(this.completionDate)) {
      await poll.update({
        isDone: true
      });
    }

    return false;
  };

  // start a new poll
  PollQuery.prototype.startNewPoll = async function(
    userId,
    question,
    completionDate
  ) {
    if (!userId) {
      throw errors.ParameterError("userId", "That userId does not exist.");
    } else if (!question) {
      throw errors.ParameterError("question", "The poll requires a question");
    } else if (!duration) {
      throw errors.ParameterError(
        "duration",
        "We need to know how long the poll will be open."
      );
    }

    // work out the completionDate
    const finished = moment().add(duration, "days");

    await PollQuery.create({ UserId, question, completionDate: finished });

    return true;
  };

  return PollQuery;
};
