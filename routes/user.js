const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers");

router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ success: 200 });
  }
);

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  controller.getAllUsers
);
router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  controller.getUserMeta
);
router.get(
  "/profile/:username",
  passport.authenticate("jwt", { session: false }),
  controller.userProfile
);

router.post("/login", controller.login);
router.post("/register", controller.register);

router.post("/logout", controller.logout);

router.put(
  "/profile/:username",
  passport.authenticate("jwt", { session: false }),
  controller.updateProfile
);

// soft deletes account
router.delete(
  "/profile/:username/close",
  passport.authenticate("jwt", { session: false }),
  controller.closeAccount
);

// perminately deletes a users account - requires admin
router.delete(
  "/profile/:username",
  passport.authenticate("jwt", { session: false }),
  controller.deleteUser
);

// TEMPORARY EMAIL VERIFICATION ROUTE
router.get("/verify/email/:token", controller.verifyEmail);

module.exports = router;
