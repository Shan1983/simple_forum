const express = require("express");
const router = express.Router();

const middelware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/setting");
const logger = require("../services/middlewares/logger");

router.post(
  "/maintenance",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postMaintenance
);

router.post(
  "/lock-forum",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postLockForum
);

router.all("*", (req, res, next) => {
  if (req.app.locals.maintenance || req.app.locals.lockForum) {
    res.status(503);
    res.json({ status: 503 });
  } else {
    next();
  }
});

router.get(
  "/",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.getAllSettings
);

router.get("/clan-shield", controller.getClanShield);

router.post(
  "/forum-name",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postForumName
);

router.post(
  "/forum-description",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postForumDescription
);

router.post(
  "/show-description",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postShowDescription
);

router.post(
  "/show-clan-size",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postShowClanSize
);

router.post(
  "/show-blacklist",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postShowBlacklist
);

router.post(
  "/show-clan-shield",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postShowClanShield
);

router.post(
  "/maintenance",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postMaintenance
);

router.post(
  "/allow-best-post",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postAllowBestPost
);

router.post(
  "/allow-email-subscriptions",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postAllowEmailSubs
);

router.post(
  "/repost-time",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postReportTime
);

router.post(
  "/allow-likes",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postAllowLikes
);

router.post(
  "/editor",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postEditor
);

router.post(
  "/set-admin",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postSetAdmin
);

router.post(
  "/set-word-limit",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postSetWordLimit
);

router.post(
  "/allow-subscriptions",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postAllowSubs
);

router.post(
  "/allow-sticky-posts",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  logger.general,
  controller.postAllowStickyPosts
);

module.exports = router;
