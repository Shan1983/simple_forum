const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers");

router.get("/", controller.getAllUsers);

// router.get("/login", passport.authenticate("jwt"), controller.login);

module.exports = router;
