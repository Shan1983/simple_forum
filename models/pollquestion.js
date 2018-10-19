"use strict";
const moment = require("moment");
const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const PollQuestion = sequelize.define(
    "PollQuestion",
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
      active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {}
  );

  // class methods
  PollQuestion.associate = function(models) {
    PollQuestion.belongsTo(models.User);
    PollQuestion.hasMany(models.PollResponse);
    PollQuestion.hasMany(models.PollVote);
  };

  // instance methods

  // check if poll is finished
  PollQuestion.prototype.checkIfFinished = async function(id) {
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
  PollQuestion.prototype.startNewPoll = async function(
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

    await PollQuestion.create({ UserId, question, completionDate: finished });

    return true;
  };

  return PollQuestion;
};
