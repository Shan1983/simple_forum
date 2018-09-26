"use strict";
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      ThreadId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER
    },
    {}
  );

  // class methods

  Subscription.associate = function(models) {
    Subscription.belongsTo(models.Thread);
  };

  // setup email for subs

  // setup stop emails

  // setup functionality for canceling subscriptions

  return Subscription;
};
