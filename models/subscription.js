"use strict";
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      ThreadId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      sendEmails: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {}
  );

  // class methods

  Subscription.associate = function(models) {
    Subscription.belongsTo(models.Thread);
    Subscription.belongsTo(models.User);
  };

  // setup email for subs

  // setup stop emails

  // setup functionality for canceling subscriptions

  return Subscription;
};
