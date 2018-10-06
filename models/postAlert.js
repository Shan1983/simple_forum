"use strict";
module.exports = (sequelize, DataTypes) => {
  const PostAlert = sequelize.define(
    "PostAlert",
    {},
    {
      classMethods: {
        associate(models) {
          PostAlert.belongsTo(models.User);
          PostAlert.belongsTo(models.Post);
          PostAlert.belongsTo(models.Alert);
        }
      }
    }
  );

  return PostAlert;
};
