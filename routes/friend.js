const express = require("express");
const router = express.Router();
const middleware = require("../services/middlewares/authMiddleware");

const controller = require("../controllers/friend");

router.get(
  "/:userId/all",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.getAllUserFriends
);

router.post(
  "/:userId/accept",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.accept
);

router.post(
  "/:userId/decline",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.decline
);

router.post(
  "/:userId/new",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.addFriend
);

router.delete(
  "/:fromId/:toId/remove",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.removeFriend
);

module.exports = router;
