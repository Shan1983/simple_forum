'use strict';
module.exports = (sequelize, DataTypes) => {
  const friend = sequelize.define('friend', {
    username: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  friend.associate = function(models) {
    // associations can be defined here
  };
  return friend;
};