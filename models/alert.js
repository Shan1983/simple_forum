'use strict';
module.exports = (sequelize, DataTypes) => {
  const alert = sequelize.define('alert', {
    UserId: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  }, {});
  alert.associate = function(models) {
    // associations can be defined here
  };
  return alert;
};