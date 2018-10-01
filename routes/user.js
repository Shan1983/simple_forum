const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers");

router.get("/", passport.authenticate("jwt"), controller.getAllUsers);
router.get("/:username", passport.authenticate("jwt"), controller.getUserMeta);

// router.get("/login", passport.authenticate("jwt"), controller.login);

module.exports = router;
