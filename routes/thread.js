const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers/thread");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.postNewThread
);

module.exports = router;