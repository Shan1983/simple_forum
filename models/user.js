'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    description: DataTypes.STRING,
    colorIcon: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    RoleId: DataTypes.INTEGER,
    VillageId: DataTypes.INTEGER,
    PlayerId: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    facbookToken: DataTypes.STRING,
    googleToken: DataTypes.STRING,
    FriendId: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    IpId: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};