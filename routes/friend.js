const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/friend");

router.get(
  "/:userId/all",
  passport.authenticate("jwt", { session: false }),
  controller.getAllUserFriends
);

router.post(
  "/:userId/new",
  passport.authenticate("jwt", { session: false }),
  controller.addFriend
);

router.delete(
  "/remove/:userId/remove",
  passport.authenticate("jwt", { session: false }),
  controller.removeFriend
);

module.exports = router;
