const express = require("express");
const router = express.Router();

const controller = require("../controllers/thread");
const middleware = require("../services/middlewares/authMiddleware");
const logger = require("../services/middlewares/logger");

router.all("*", (req, res, next) => {
  if (req.app.locals.maintenance || req.app.locals.lockForum) {
    res.status(503);
    res.json({ status: 503 });
  } else {
    next();
  }
});

router.post(
  "/:category/",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.postNewThread
);

router.post(
  "/:threadId/lock",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.lockThread
);

router.get(
  "/:threadId/reasons",
  middleware.isAuthenticated,
  logger.general,
  controller.lockReasons
);

router.post(
  "/:threadId/make-sticky",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.stickyThread
);

router.post(
  "/:threadId/move",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.moveThread
);

router.get(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.getThread
);

router.get(
  "/:categoryId/deleted/threads",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  logger.general,
  controller.getDeletedThreads
);

router.put(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.updateThread
);

router.delete(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  logger.general,
  controller.deleteThread
);
module.exports = router;
