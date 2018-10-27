const express = require("express");
const router = express.Router();
const middleware = require("../services/middlewares/authMiddleware");

const controller = require("../controllers/friend");
const logger = require("../services/middlewares/logger");

router.all("*", (req, res, next) => {
  if (req.app.locals.maintenance || req.app.locals.lockForum) {
    res.status(503);
    res.json({ status: 503 });
  } else {
    next();
  }
});

router.get(
  "/:userId/all",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.getAllUserFriends
);

router.post(
  "/:userId/accept",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.accept
);

router.post(
  "/:userId/decline",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.decline
);

router.post(
  "/:userId/new",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.addFriend
);

router.delete(
  "/:fromId/:toId/remove",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.removeFriend
);

module.exports = router;
