'use strict';
module.exports = (sequelize, DataTypes) => {
  const subscription = sequelize.define('subscription', {
    ThreadId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  subscription.associate = function(models) {
    // associations can be defined here
  };
  return subscription;
};