"use strict";

const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      username: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      requestTo: {
        type: Sequelize.INTEGER
      },
      requestFrom: {
        type: Sequelize.INTEGER
      },
      accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );

  // class methods

  Friend.associate = function(models) {
    Friend.belongsToMany(models.User, { throught: "FriendUser" });
  };

  // instance methods

  Friend.prototype.getFriendCount = function() {
    return Friend.count();
  };

  // data contains {myId, theirId}
  Friend.prototype.newFriendRequest = async function(data) {
    const { User, Friend } = sequelize.models;

    // get the request from user
    const me = await User.findById(data.myId);

    // get the request to user
    const you = await User.findById(data.theirId);

    if (!you) {
      throw errors.sequelizeValidation(sequelize, {
        errors: "That user does not exist.",
        id: theirId
      });
    }

    const friend = await Friend.create({
      UserId: me.id,
      requestTo: you.id,
      requestFrom: me.id,
      username: me.username
    });

    return friend;
  };

  Friend.prototype.acceptFriendRequest = async function(data) {
    const { User, FriendUser } = sequelize.models;

    // get the request from user
    const me = await User.findById(data.myId);

    // get the request to user
    const you = await User.findById(data.theirId);

    const friendUser = FriendUser.create();
    friendUser.setUser(me);
    friendUser.setUser(you);
  };

  Friend.prototype.declineFriendRequest = async function(data) {
    const { FriendUser } = sequelize.models;

    await FriendUser.destroy({
      where: { UserId: data.id }
    });

    return true;
  };

  return Friend;
};
