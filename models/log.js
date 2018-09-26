"use strict";
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    "Log",
    {
      UserId: DataTypes.INTEGER,
      ThreadId: DataTypes.INTEGER,
      SessionId: DataTypes.INTEGER,
      resource: DataTypes.STRING,
      method: DataTypes.STRING,
      status: DataTypes.INTEGER
    },
    {}
  );
  Log.associate = function(models) {
    Log.belongsTo(models.Thread);
    Log.belongsTo(models.User);
    Log.belongsTo(models.User, { as: "SessionUser" });
    Log.belongsTo(models.Like);
    Log.belongsTo(models.Ban);
    Log.belongsTo(models.PenaltyBox);
    Log.belongsTo(models.Post);
    Log.belongsTo(models.Category);
    Log.belongsTo(models.PollQuery);
    Log.belongsTo(models.PollBallot);
    Log.belongsTo(models.Report);
    Log.belongsTo(models.Search);
    Log.belongsTo(models.Setting);
    Log.belongsTo(models.Subscription);
  };
  return Log;
};
