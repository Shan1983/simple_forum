'use strict';
module.exports = (sequelize, DataTypes) => {
  const FriendUser = sequelize.define('FriendUser', {
    UserId: DataTypes.INTEGER,
    FriendId: DataTypes.INTEGER
  }, {});
  FriendUser.associate = function(models) {
    // associations can be defined here
  };
  return FriendUser;
};