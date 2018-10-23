const { Setting } = require("../../models");
const attributes = require("../../helpers/getModelAttributes");

// "/";
exports.getAllSettings = async (req, res, next) => {
  try {
    const settingObj = {
      forumName: req.app.locals.forumName,
      forumDescription: req.app.locals.forumDescription,
      clanTag: req.app.locals.clanTag,
      clanSize: req.app.locals.clanSize,
      initialSetup: req.app.locals.initialSetup,
      clanShield: req.app.locals.clanShield,
      showDescription: req.app.locals.showDescription,
      showClanSize: req.app.locals.showClanSize,
      showBlacklist: req.app.locals.showBlacklist,
      showClanShield: req.app.locals.showClanShield,
      maintenance: req.app.locals.maintenance,
      lockForum: req.app.locals.lockForum,
      allowBestPosts: req.app.locals.allowBestPosts,
      emailSubscriptionparticipants:
        req.app.locals.emailSubscriptionparticipants,
      repostingDuration: req.app.locals.repostingDuration,
      allowLikes: req.app.locals.allowLikes,
      editor: req.app.locals.editor,
      setAdminUser: req.app.locals.setAdminUser,
      setMaxDiscussionWordLimit: req.app.locals.setMaxDiscussionWordLimit,
      allowSubscriptions: req.app.locals.allowSubscriptions,
      allowStickyThreads: req.app.locals.allowStickyThreads
    };
    res.json(settingObj);
  } catch (error) {
    next(error);
  }
};
// "/clan-shield"
exports.getClanShield = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
// "/forum-name"
exports.postForumName = async (req, res, next) => {
  try {
    await Setting.update(
      { forumName: req.body.forumName },
      { where: { id: 1 } }
    );
    req.app.locals.forumName = req.body.forumName;

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/forum-description"
exports.postForumDescription = async (req, res, next) => {
  try {
    await Setting.update(
      { forumDescription: req.body.forumDescription },
      { where: { id: 1 } }
    );
    req.app.locals.forumDescription = req.body.forumDescription;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/show-description"
exports.postShowDescription = async (req, res, next) => {
  try {
    await Setting.update(
      { showDescription: req.body.showDescription },
      { where: { id: 1 } }
    );
    req.app.locals.showDescription = req.body.forumDescription;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/show-clan-size"
exports.postShowClanSize = async (req, res, next) => {
  try {
    await Setting.update(
      { showClanSize: req.body.showClanSize },
      { where: { id: 1 } }
    );
    req.app.locals.showClanSize = req.body.showClanSize;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/show-blacklist"
exports.postShowBlacklist = async (req, res, next) => {
  try {
    await Setting.update(
      { showBlacklist: req.body.showBlacklist },
      { where: { id: 1 } }
    );
    req.app.locals.showBlacklist = req.body.showBlacklist;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/show-clan-shield"
exports.postShowClanShield = async (req, res, next) => {
  try {
    await Setting.update(
      { showClanShield: req.body.showClanShield },
      { where: { id: 1 } }
    );
    req.app.locals.showClanShield = req.body.showClanShield;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/maintenance"
exports.postMaintenance = async (req, res, next) => {
  try {
    await Setting.update(
      { maintenance: req.body.maintenance },
      { where: { id: 1 } }
    );
    req.app.locals.maintenance = req.body.maintenance;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/lock-forum"
exports.postLockForum = async (req, res, next) => {
  try {
    await Setting.update(
      { lockForum: req.body.lockForum },
      { where: { id: 1 } }
    );
    req.app.locals.lockForum = req.body.lockForum;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/allow-best-post"
exports.postAllowBestPost = async (req, res, next) => {
  try {
    await Setting.update(
      { allowBestPosts: req.body.allowBestPosts },
      { where: { id: 1 } }
    );
    req.app.locals.allowBestPosts = req.body.allowBestPosts;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/allow-email-subscriptions"
exports.postAllowEmailSubs = async (req, res, next) => {
  try {
    await Setting.update(
      { allowSubscriptions: req.body.allowSubscriptions },
      { where: { id: 1 } }
    );
    req.app.locals.allowSubscriptions = req.body.allowSubscriptions;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/repost-time"
exports.postReportTime = async (req, res, next) => {
  try {
    await Setting.update(
      { repostingDuration: req.body.repostingDuration },
      { where: { id: 1 } }
    );
    req.app.locals.repostingDuration = req.body.repostingDuration;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/allow-likes"
exports.postAllowLikes = async (req, res, next) => {
  try {
    await Setting.update(
      { allowLikes: req.body.allowLikes },
      { where: { id: 1 } }
    );
    req.app.locals.allowLikes = req.body.allowLikes;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/editor"
exports.postEditor = async (req, res, next) => {
  try {
    await Setting.update({ editor: req.body.editor }, { where: { id: 1 } });
    req.app.locals.editor = req.body.editor;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/set-admin
exports.postSetAdmin = async (req, res, next) => {
  try {
    await Setting.update(
      { setAdminUser: req.body.setAdminUser },
      { where: { id: 1 } }
    );
    req.app.locals.setAdminUser = req.body.setAdminUser;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/set-word-limit"
exports.postSetWordLimit = async (req, res, next) => {
  try {
    await Setting.update(
      { setMaxDiscussionWordLimit: req.body.setMaxDiscussionWordLimit },
      { where: { id: 1 } }
    );
    req.app.locals.setMaxDiscussionWordLimit =
      req.body.setMaxDiscussionWordLimit;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/allow-subscriptions"
exports.postAllowSubs = async (req, res, next) => {
  try {
    await Setting.update(
      { allowSubscriptions: req.body.allowSubscriptions },
      { where: { id: 1 } }
    );
    req.app.locals.allowSubscriptions = req.body.allowSubscriptions;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
// "/allow-sticky-posts"
exports.postAllowStickyPosts = async (req, res, next) => {
  try {
    await Setting.update(
      { allowStickyThreads: req.body.allowStickyThreads },
      { where: { id: 1 } }
    );
    req.app.locals.allowStickyThreads = req.body.allowStickyThreads;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
