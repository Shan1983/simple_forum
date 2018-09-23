'use strict';
module.exports = (sequelize, DataTypes) => {
  const ipaddress = sequelize.define('ipaddress', {
    ipAddress: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  ipaddress.associate = function(models) {
    // associations can be defined here
  };
  return ipaddress;
};