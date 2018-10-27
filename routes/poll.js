const express = require("express");
const router = express.Router();

const middleware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/poll");
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
  "/:pollId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.getAPoll
);

router.get(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.getAllPolls
);

router.get(
  "/:pollId/results",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.generatePollResults
);

router.post(
  "/:threadId/new",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.newPoll
);

router.post(
  "/:pollId/:responseId/vote",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.voteOnPoll
);

router.put(
  "/:pollId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.editPoll
);

router.delete(
  "/:pollId/remove",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.removePoll
);

module.exports = router;
