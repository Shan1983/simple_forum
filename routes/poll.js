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
  "/all",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.getAllPolls
);

router.post(
  "/new",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.newPoll
);

router.post(
  "/:pollId/questions",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.newPollQuestions
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
  controller.removePoll
);

module.exports = router;
