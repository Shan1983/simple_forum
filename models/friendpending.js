"use strict";
module.exports = (sequelize, DataTypes) => {
  const FriendPending = sequelize.define(
    "FriendPending",
    {
      username: DataTypes.STRING,
      requestTo: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      accepted: DataTypes.BOOLEAN,
      deletedAt: { type: DataTypes.DATE }
    },
    { paranoid: true }
  );
  FriendPending.associate = function(models) {
    FriendPending.hasMany(models.Friend);
    FriendPending.hasMany(models.User);
  };
  return FriendPending;
};
