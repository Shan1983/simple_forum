const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers");

router.get("/all", passport.authenticate("jwt"), controller.getAllUsers);
router.get("/:username", passport.authenticate("jwt"), controller.getUserMeta);
router.get(
  "/profile/:username",
  passport.authenticate("jwt"),
  controller.userProfile
);

router.post("/login", controller.login);
router.post("/register", controller.register);

router.post("/logout", controller.logout);

router.put(
  "/profile/:username",
  passport.authenticate("jwt"),
  controller.updateProfile
);

// soft deletes account
router.delete(
  "/profile/:username/close",
  passport.authenticate("jwt"),
  controller.closeAccount
);

// perminately deletes a users account - requires admin
router.delete(
  "/profile/:username",
  passport.authenticate("jwt"),
  controller.deleteUser
);

// TEMPORARY EMAIL VERIFICATION ROUTE
router.get("/verify/email/:token", controller.verifyEmail);

module.exports = router;
