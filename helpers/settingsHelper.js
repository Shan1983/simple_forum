const { Setting } = require("../models");
const attributes = require("./getModelAttributes");

exports.intialSettingSetup = async () => {
  // initial settings setup
  const data = {
    forumName: "Forum Name",
    forumDescription: "Tell us about what your forum will be used for.",
    clanTag: "#12345",
    clanSize: 50,
    initialSetup: true,
    clanShield: "path/to/clan/shield",
    showDescription: true,
    showClanSize: true,
    showBlacklist: true,
    showClanShield: true,
    maintenance: false,
    lockForum: false,
    allowBestPosts: true,
    emailSubscriptionparticipants: true,
    repostingDuration: 3,
    allowLikes: true,
    editor: "Plain Editor",
    setAdminUser: 1,
    setMaxDiscussionWordLimit: 1024,
    allowSubscriptions: true,
    allowStickyThreads: true
  };

  const settings = await Setting.findById(1);
  const settingReq = attributes.convert(settings);
  if (!settingReq.init) {
    await Setting.initialSetup(data);
  }

  return data;
};
