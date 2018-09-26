"use strict";
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      UserId: DataTypes.INTEGER,
      ThreadId: DataTypes.INTEGER,
      PostId: DataTypes.INTEGER
    },
    {}
  );
  Like.associate = function(models) {
    Like.belongsTo(models.User);
    Like.belongsTo(models.Thread);
    Like.belongsTo(models.Post);
  };
  return Like;
};
