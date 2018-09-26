"use strict";
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      username: DataTypes.STRING,
      UserId: DataTypes.INTEGER
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
