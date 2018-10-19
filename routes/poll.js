const express = require("express");
const router = express.Router();

const middleware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/poll");

router.get(
  "/:pollId",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.getAPoll
);

router.get(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.getAllPolls
);

router.post(
  "/:threadId/new",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.newPoll
);

router.post(
  "/:pollId/vote",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.voteOnPoll
);

router.put(
  "/:pollId",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.editPoll
);

router.delete(
  "/:pollId/remove",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.removePoll
);

module.exports = router;
