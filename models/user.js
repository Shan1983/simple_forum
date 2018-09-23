'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    description: DataTypes.TEXT,
    colorIcon: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    RoleId: DataTypes.INTEGER,
    VillageId: DataTypes.INTEGER,
    PlayerId: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    facebookToken: DataTypes.STRING,
    googleToken: DataTypes.STRING,
    FriendId: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    IpId: DataTypes.INTEGER
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};