const express = require("express");
const router = express.Router();
passport = require("passport");

const controller = require("../controllers/ban/");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.addBan
);
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.removeBan
);

module.exports = router;
