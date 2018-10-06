"use strict";

const nodemailer = require("../helpers/nodeMailer");

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

  // set up user for emails
  Subscription.setUpEmail = function(UserId, ThreadId) {
    Subscription.create({
      ThreadId,
      UserId
    });
  };

  // instance methods

  // send email for subs
  Subscription.prototype.sendMail = async function(userId, req) {
    const { User } = sequelize.models;

    const user = await User.findById(userId);

    if (user.subscriptionEmail) {
      await nodemailer.send(req);
      return true;
    } else {
      return false;
    }
  };

  // setup stop emails
  Subscription.prototype.stopEmails = async function(userId) {
    const { User } = sequelize.models;

    const user = await User.findById(userId);

    await user.update({ subscriptionEmail: false });

    return true;
  };

  return Subscription;
};
