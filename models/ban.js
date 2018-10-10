"use strict";

const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const Ban = sequelize.define(
    "Ban",
    {
      UserId: {
        type: DataTypes.INTEGER
      },
      ipBanned: {
        type: DataTypes.STRING
        // validate: {
        //   isString(val) {
        //     if (typeof val !== "string") {
        //       throw new sequelize.ValidationError(
        //         "The IP Adress must be a string."
        //       );
        //     }
        //   }
        // }
      },
      reason: {
        type: DataTypes.TEXT,
        validate: {
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError(
                "The reason must be a string."
              );
            }
          }
        }
      }
    },
    {}
  );

  // class methods

  Ban.associate = function(models) {
    Ban.belongsTo(models.User);
  };

  Ban.getAttributes = function(banned) {
    return banned.toJSON();
  };

  // ban a user from accessing the forum
  Ban.banUser = async function(userId, ip, reason) {
    await Ban.create({
      UserId: userId,
      ipBanned: ip,
      reason
    });
  };

  // unban a user from accessing the forum
  Ban.unbanUser = async function(userId) {
    await Ban.destroy({ where: { UserId: userId } });
  };

  Ban.checkIfBanned = async function(user) {
    if (!user) {
      errors.parameterError(
        "username",
        "The username supplied does not exist."
      );
    }

    // check if the user is actually banned
    const banned = await Ban.findOne({
      where: { UserId: user.id }
    });

    if (!banned) {
      return false;
    } else {
      throw errors.sequelizeValidation(sequelize, {
        error: banned.reason || "You have been banned!"
      });
    }
  };

  return Ban;
};
