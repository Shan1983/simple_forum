"use strict";

const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      username: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      requestTo: {
        type: Sequelize.INTEGER
      },
      requestFrom: {
        type: Sequelize.INTEGER
      },
      accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );

  // class methods

  Friend.associate = function(models) {
    Friend.belongsToMany(models.User, { throught: "frienduser" });
  };

  // instance methods

  Friend.prototype.getFriendCount = function() {
    return Friend.count();
  };

  return Friend;
};
