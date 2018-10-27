"use strict";
module.exports = (sequelize, DataTypes) => {
  const GeneralLog = sequelize.define(
    "GeneralLog",
    {
      ip: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      path: DataTypes.STRING,
      type: { type: DataTypes.ENUM, values: ["info", "error"] },
      method: DataTypes.STRING,
      status: DataTypes.INTEGER,
      message: DataTypes.STRING
    },
    {}
  );
  GeneralLog.associate = function(models) {
    // associations can be defined here
  };
  return GeneralLog;
};
