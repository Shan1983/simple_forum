const express = require("express");
const router = express.Router();

const middleware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/blacklist");

router.get(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.getBlacklist
);

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.addToBlacklist
);

router.delete(
  "/:id",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.removeFromBlacklist
);

module.exports = router;
