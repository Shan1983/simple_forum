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
        type: DataTypes.BOOLEAN,
        defaultValue: false
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

  // ban a user from accessing the forum
  Ban.banUser = async function(username, reason) {
    const { User, Ip } = sequelize.models;

    if (username) {
      // get the user details
      const user = await User.findOne({
        where: { username }
      });

      // check if they are super system or an admin
      if (user.Role.role === "System" || user.Role.role === "Administrator") {
        return errors.banError;
      }

      // get the users ip address
      const ip = await Ip.findOne({
        where: { UserId: user.id },
        include: [
          {
            model: User,
            attributes: ["id", "username", "avatar"]
          }
        ]
      });

      // if the user doesnt have an ip, if the user
      // doesn't somehow have an ip we will ban them using their email address
      if (!ip) {
        Ban.banByEmail(user);
      }

      // right now for the banning
      if (!ip) {
        Ban.update({
          bannedEmail: user.email,
          UserId: user.id,
          reason
        });
      } else if (ip) {
        Ban.update({
          UserId: user.id,
          ipBanned: true,
          ipAddress: ip.ipAddress
        });
      }
    }
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
