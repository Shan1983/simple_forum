const express = require("express");
const router = express.Router();

const middelware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/setting");

router.get(
  "/",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.getAllSettings
);

router.get("/clan-shield", controller.getClanShield);

router.post(
  "/forum-name",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postForumName
);

router.post(
  "/forum-description",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postForumDescription
);

router.post(
  "/show-description",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postShowDescription
);

router.post(
  "/show-clan-size",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postShowClanSize
);

router.post(
  "/show-blacklist",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postShowBlacklist
);

router.post(
  "/show-clan-shield",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postShowClanShield
);

router.post(
  "/maintenance",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postMaintenance
);

router.post(
  "/lock-forum",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postLockForum
);

router.post(
  "/allow-best-post",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postAllowBestPost
);

router.post(
  "/allow-email-subscriptions",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postAllowEmailSubs
);

router.post(
  "/repost-time",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postReportTime
);

router.post(
  "/allow-likes",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postAllowLikes
);

router.post(
  "/editor",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postEditor
);

router.post(
  "/set-admin",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postSetAdmin
);

router.post(
  "/set-word-limit",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postSetWordLimit
);

router.post(
  "/allow-subscriptions",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postAllowSubs
);

router.post(
  "/allow-sticky-posts",
  middelware.isAuthenticated,
  middelware.canContinue,
  middelware.isAdmin,
  controller.postAllowStickyPosts
);

module.exports = router;
