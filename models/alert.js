"use strict";
module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define(
    "Alert",
    {
      UserId: {
        type: DataTypes.INTEGER
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      type: {
        type: DataTypes.ENUM,
        values: [
          "mention",
          "thread update",
          "reply",
          "friend request",
          "punishment"
        ]
      }
    },
    {}
  );

  // class methods

  Alert.associate = function(models) {
    Alert.hasOne(models.PostAlert);
    Alert.belongsTo(models.User);
    Alert.belongsTo(models.Friend);
    Alert.belongsTo(models.PenaltyBox);
  };

  // data consists of {username, usernameTo, post, type}

  Alert.makePostAlert = async function(data) {
    const { PostAlert, User, Post } = sequelize.models;

    const me = await User.findOne({
      where: { username: data.username }
    });

    const userToAlert = await User.findone({
      where: { username: data.usernameTo }
    });

    if (!userToAlert) {
      return null;
    }

    const alert = await Alert.create({
      UserId: userToAlert.id,
      type: data.type
    });

    const postAlert = await PostAlert.create();

    await postAlert.setUser(me);
    await postAlert.setPost(data.post);

    await alert.setPostAlert(postAlert);
    await alert.setUser(userToAlert);

    const reloadAlerts = await alert.reload({
      include: [
        {
          model: PostAlert,
          include: [
            Post,
            { model: User, attributes: ["username", "color", "avatar"] }
          ]
        }
      ]
    });

    return reloadAlerts;
  };

  Alert.makeFriendRequestAlert = async function(data) {
    const { User, Friend } = sequelize.models;

    const me = await User.findOne({ where: { username: data.username } });

    const userToAlert = await User.findone({
      where: { username: data.usernameTo }
    });

    if (!userToAlert) {
      return null;
    }

    const alert = await Alert.create({
      UserId: userToAlert.id,
      type: data.type
    });

    const friendAlert = await Friend.create();

    await friendAlert.setUser(me);
    await friendAlert.setPost(data.post);

    await alert.setFriendAlert(friendAlert);
    await alert.setUser(userToAlert);

    const reloadAlerts = await alert.reload({
      include: [
        {
          model: Friend,
          include: [
            Post,
            { model: User, attributes: ["username", "color", "avatar"] }
          ]
        }
      ]
    });

    return reloadAlerts;
  };

  Alert.makePunishmentAlert = async function(data) {
    const { User, PenaltyBox } = sequelize.models;

    const me = await User.findOne({ where: { username: data.username } });

    const userToAlert = await User.findone({
      where: { username: data.usernameTo }
    });

    if (!userToAlert) {
      return null;
    }

    const alert = await Alert.create({
      UserId: userToAlert.id,
      type: data.type
    });

    const penaltyAlert = await PenaltyBox.create();

    await penaltyAlert.setUser(me);
    await penaltyAlert.setPost(data.post);

    await alert.setPenaltyAlert(penaltyAlert);
    await alert.setUser(userToAlert);

    const reloadAlerts = await alert.reload({
      include: [
        {
          model: PenaltyBox,
          include: [
            Post,
            { model: User, attributes: ["username", "color", "avatar"] }
          ]
        }
      ]
    });

    return reloadAlerts;
  };

  // instance methods

  return Alert;
};
