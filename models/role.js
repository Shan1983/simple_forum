'use strict';
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    role: DataTypes.ENUM
  }, {});
  role.associate = function(models) {
    // associations can be defined here
  };
  return role;
};