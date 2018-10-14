const express = require("express");
const router = express.Router();

const controller = require("../controllers/thread");
const middleware = require("../services/middlewares/authMiddleware");

router.post(
  "/:category/",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.postNewThread
);

router.post(
  "/:threadId/lock",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.lockThread
);

router.get(
  "/:threadId/reasons",
  middleware.isAuthenticated,
  controller.lockReasons
);

router.post(
  "/:threadId/make-sticky",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.stickyThread
);

router.post(
  "/:threadId/move",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.moveThread
);

router.get(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.getThread
);

router.get(
  "/:categoryId/deleted/threads",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.getDeletedThreads
);

router.put(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.updateThread
);

router.delete(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.deleteThread
);
module.exports = router;
