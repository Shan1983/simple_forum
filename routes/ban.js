const express = require("express");
const router = express.Router();

const controller = require("../controllers/ban/");
const middleware = require("../services/middlewares/authMiddleware");

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.addBan
);
router.delete(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.removeBan
);

module.exports = router;
