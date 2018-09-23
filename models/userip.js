'use strict';
module.exports = (sequelize, DataTypes) => {
  const userip = sequelize.define('userip', {
    IpId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  userip.associate = function(models) {
    // associations can be defined here
  };
  return userip;
};