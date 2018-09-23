'use strict';
module.exports = (sequelize, DataTypes) => {
  const penaltyBox = sequelize.define('penaltyBox', {
    UserId: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    userCanCreatePost: DataTypes.BOOLEAN,
    userCanCreateThread: DataTypes.BOOLEAN,
    severity: DataTypes.ENUM
  }, {});
  penaltyBox.associate = function(models) {
    // associations can be defined here
  };
  return penaltyBox;
};