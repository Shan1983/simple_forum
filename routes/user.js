const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers");

router.get("/", passport.authenticate("jwt"), controller.getAllUsers);
router.get("/:username", passport.authenticate("jwt"), controller.getUserMeta);

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/logout", controller.logout);

router.put(
  "/profile/:username",
  passport.authenticate("jwt"),
  controller.updateProfile
);

router.delete(
  "/profile/:username",
  passport.authenticate("jwt"),
  controller.deleteUser
);

module.exports = router;
