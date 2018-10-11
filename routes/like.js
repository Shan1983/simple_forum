const express = require("express");
const router = express.Router();

const controller = require("../controllers/like");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.addThreadLike
);

router.delete(
  "/remove",
  passport.authenticate("jwt", { session: false }),
  controller.removeLike
);

module.exports = router;
