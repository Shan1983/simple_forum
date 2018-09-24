"use strict";
module.exports = (sequelize, DataTypes) => {
  const setting = sequelize.define(
    "setting",
    {
      forumName: DataTypes.STRING,
      forumDescription: DataTypes.TEXT,
      clanTag: DataTypes.STRING,
      clanSize: DataTypes.INTEGER,
      BlacklistId: DataTypes.INTEGER,
      initialSetup: DataTypes.BOOLEAN,
      clanShield: DataTypes.STRING,
      showDescription: DataTypes.BOOLEAN,
      showClanSize: DataTypes.BOOLEAN,
      showBlacklist: DataTypes.BOOLEAN,
      showClanShield: DataTypes.BOOLEAN,
      maintenance: DataTypes.BOOLEAN,
      lockForum: DataTypes.BOOLEAN,
      allowBestPosts: DataTypes.BOOLEAN,
      emailSubscriptionparticipants: DataTypes.BOOLEAN,
      repostingDuration: DataTypes.INTEGER,
      allowLikes: DataTypes.BOOLEAN,
      editor: DataTypes.ENUM,
      setAdminUser: DataTypes.INTEGER,
      numberOfAdmins: DataTypes.INTEGER,
      setMaxDiscussionWordLimit: DatatTypes.INTEGER,
      allowSubscriptions: DataTypes.BOOLEAN,
      allowStickyThreads: DataTypes.BOOLEAN
    },
    {}
  );
  setting.associate = function(models) {
    // associations can be defined here
  };
  return setting;
};
