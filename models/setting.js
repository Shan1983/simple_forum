"use strict";
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define(
    "Setting",
    {
      forumName: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 80],
            msg: "The forums name must be between 1 and 80 characters"
          },
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError(
                "The forums name must be a string"
              );
            }
          }
        }
      },
      forumDescription: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [1, 500],
            msg: "The description must be between 1 and 500 characters"
          },
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError(
                "The forums description must be a string"
              );
            }
          }
        }
      },
      clanTag: {
        type: DataTypes.STRING,
        validate: {
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError("The clan tag must be a string");
            }
          }
        }
      },
      clanSize: { type: DataTypes.INTEGER },
      BlacklistId: { type: DataTypes.INTEGER },
      initialSetup: { type: DataTypes.BOOLEAN, defaultVale: true },
      clanShield: { type: DataTypes.STRING },
      showDescription: { type: DataTypes.BOOLEAN, defaultValue: true },
      showClanSize: { type: DataTypes.BOOLEAN, defaultValue: true },
      showBlacklist: { type: DataTypes.BOOLEAN, defaultValue: true },
      showClanShield: { type: DataTypes.BOOLEAN, defaultValue: true },
      maintenance: { type: DataTypes.BOOLEAN, defaultValue: false },
      lockForum: { type: DataTypes.BOOLEAN, defaultValue: true },
      allowBestPosts: { type: DataTypes.BOOLEAN, defaultValue: true },
      emailSubscriptionparticipants: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      repostingDuration: { type: DataTypes.INTEGER },
      allowLikes: { type: DataTypes.BOOLEAN, defaultValue: true },
      editor: {
        type: DataTypes.ENUM,
        values: ["Plain Editor", "Markdown Editor"]
      },
      setAdminUser: { type: DataTypes.INTEGER },
      numberOfAdmins: { type: DataTypes.INTEGER },
      setMaxDiscussionWordLimit: { type: DatatTypes.INTEGER },
      allowSubscriptions: { type: DataTypes.BOOLEAN, defaultValue: true },
      allowStickyThreads: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {}
  );

  // class methods

  // Setting.associate = function(models) {
  //   Setting.hasOne(models.Blacklist);
  // };

  Setting.initialSetup = async function(data) {
    await Setting.create({
      forumName: data.forumName,
      forumDescription: data.forumDescription,
      clanTag: data.clanTag,
      clanSize: data.clanSize,
      initialSetup: false,
      clanShield: data.clanShield,
      // showDescription: true,
      // showClanSize: true,
      // showBlacklist: true,
      // showClanShield: true,
      // maintenance: false,
      // lockForum: true,
      // allowBestPosts: true,
      // emailSubscriptionparticipants: true,
      repostingDuration: data.repostingDuration,
      // allowLikes: true,
      editor: data.editor,
      setAdminUser: data.setUpUsersId,
      setMaxDiscussionWordLimit: data.wordLimit
      // allowSubscriptions: true,
      // allowStickyThreads: true
    });
  };

  // update forum settings

  Setting.changeForumName = async function(name) {
    await Setting.update({
      forumName: name
    });
  };

  Setting.changeForumDescription = async function(description) {
    await Setting.update({
      forumDescription: description
    });
  };

  Setting.changeClanTag = async function(clanTag) {
    await Setting.update({
      clanTag
    });
  };

  Setting.changeClanSize = async function(clanSize) {
    await Setting.update({
      clanSize
    });
  };

  Setting.updateClanShield = async function(clanShield) {
    await Setting.update({
      clanShield
    });
  };

  Setting.showDescription = async function(showDescription) {
    await Setting.update({
      showDescription
    });
  };

  Setting.showClanSize = async function(showClanSize) {
    await Setting.update({
      showClanSize
    });
  };

  Setting.showBlacklist = async function(showBlacklist) {
    await Setting.update({
      showBlacklist
    });
  };

  Setting.showClanShield = async function(showClanShield) {
    await Setting.update({
      showClanShield
    });
  };

  // activate maintenance
  Setting.updateMaintenance = async function(maintenance) {
    await Setting.update({
      maintenance
    });
  };

  // check maintenance mode
  Setting.checkMaintenance = function(res) {
    if (this.maintenance) {
      return res.redirect("/maintenance");
    }
    return false;
  };

  Setting.updateLockForum = async function(lockForum) {
    await Setting.update({ lockForum });
  };

  // check if the forum only accepts members from the clan or is open to all
  Setting.locked = function() {
    return this.lockForum;
  };

  Setting.allowBestPosts = async function(allowBestPosts) {
    await Setting.update({ allowBestPosts });
  };

  Setting.emailSubscriptionParticipants = async function(
    emailSubscriptionparticipants
  ) {
    await Setting.update({ emailSubscriptionparticipants });
  };

  Setting.repostingDuration = async function(repostingDuration) {
    await Setting.update({ repostingDuration });
  };

  Setting.allowLikes = async function(allowLikes) {
    await Setting.update({ allowLikes });
  };

  Setting.changeAdmin = async function(setAdminUser) {
    await Setting.update({ setAdminUser });
  };

  Setting.setMaxDiscussionWordLimit = async function(
    setMaxDiscussionWordLimit
  ) {
    await Setting.update({ setMaxDiscussionWordLimit });
  };

  Setting.allowSubscriptions = async function(allowSubscriptions) {
    await Setting.update({ allowSubscriptions });
  };

  Setting.allowStickyThreads = async function(allowStickyThreads) {
    await Setting.update({ allowStickyThreads });
  };

  return Setting;
};
