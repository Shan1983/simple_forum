"use strict";

const moment = require("moment");
const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const PenaltyBox = sequelize.define(
    "PenaltyBox",
    {
      UserId: { type: DataTypes.INTEGER },
      duration: { type: DataTypes.INTEGER },
      reason: { type: DataTypes.TEXT },
      userCanCreatePost: { type: DataTypes.BOOLEAN, defaultValue: false },
      userCanCreateThread: { type: DataTypes.BOOLEAN, defaultValue: false },
      severity: { type: DataTypes.ENUM, values: ["Low", "High"] }
    },
    {}
  );

  // class methods

  PenaltyBox.associate = function(models) {
    PenaltyBox.belongsTo(models.User);
  };

  // instance methods

  // check if user is in the penalty box
  PenaltyBox.prototype.checkIfUserIsInPenaltyBox = async function(id) {
    const { User } = sequelize.models;

    const user = await User.findById(id);

    // check if their in the box
    const penalty = await PenaltyBox.findOne({
      where: { UserId: id },
      include: [
        {
          model: PenaltyBox,
          attributes: [
            "duration",
            "userCanCreatePost",
            "userCanCreateThread",
            "severity"
          ]
        }
      ]
    });

    // check the duration, and release them if its passed
    const releaseDate = moment(Date.now(), "DD-MM-YYYY").add(duration, "days");
    const remainingTime = moment()
      .duration(releaseDate.diff(Date.now()))
      .hours();

    if (!penalty) {
      return false;
    } else if (moment().isAfter(releaseDate)) {
      await PenaltyBox.destroy({
        where: { UserId: user.id }
      });
      return false;
    } else {
      return {
        result: true,
        penalty,
        remainingTime
      };
    }
  };

  // put a user in the penalty box
  PenaltyBox.prototype.punishByPenaltyBox = async function(
    id,
    duration,
    serverity,
    reason
  ) {
    const { User } = sequelize.models;

    const user = await User.findById(id);

    if (!user) {
      throw errors.sequelizeValidation(sequelize, {
        error: "That user does not exist."
      });
    }

    if (serverity === "Low") {
      await PenaltyBox.update({
        userCanCreateThread: false,
        duration: moment(Date.now(), "DD-MM-YYYY").add(duration, "days"),
        reason
      });
    } else if (serverity === "High") {
      await PenaltyBox.update({
        userCanCreatePost: false,
        userCanCreateThread: false,
        duration: moment(Date.now(), "DD-MM-YYYY").add(duration, "days"),
        reason
      });
    }

    await PenaltyBox.reload();
  };

  // release a user from the penalty box early
  PenaltyBox.prototype.releaseUserFromPenaltyBox = async function(id) {
    const { User } = sequelize.models;

    const user = await User.findById(id);

    if (!user) {
      throw errors.sequelizeValidation(sequelize, {
        errors: "User does not exist."
      });
    }

    await PenaltyBox.destroy({
      where: { UserId: user.id }
    });

    await PenaltyBox.reload();
  };

  return PenaltyBox;
};
