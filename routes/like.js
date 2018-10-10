const express = require("express");
const router = express.Router();

const controller = require("../controllers/like");
const passport = require("passport");

router.post(
  "/",
  passport.autheniticate("jwt", { session: false }),
  controller.addLike
);

router.delete(
  "/:likeId",
  passport.authenticate("jwt", { session: false }),
  controller.removeLike
);

module.exports = router;
