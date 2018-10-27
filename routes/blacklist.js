const express = require("express");
const router = express.Router();

const middleware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/blacklist");
const logger = require("../services/middlewares/logger");

router.all("*", (req, res, next) => {
  if (req.app.locals.maintenance || req.app.locals.lockForum) {
    res.status(503);
    res.json({ status: 503 });
  } else {
    next();
  }
});

router.get(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.getBlacklist
);

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.addToBlacklist
);

router.delete(
  "/:id",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  logger.general,
  controller.removeFromBlacklist
);

module.exports = router;
