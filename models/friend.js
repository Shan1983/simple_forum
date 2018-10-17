"use strict";

const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      UserId: {
        type: DataTypes.INTEGER
      },
      acceptingFriend: {
        type: DataTypes.INTEGER
      },
      deletedAt: { type: DataTypes.DATE }
    },
    { paranoid: true }
  );

  // class methods

  Friend.associate = function(models) {
    Friend.belongsTo(models.User);
    Friend.belongsTo(models.FriendPending);
  };

  return Friend;
};
