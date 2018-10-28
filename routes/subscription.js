const express = require("express");
const router = express.Router();

const controller = require("../controllers/subscription");
const middleware = require("../services/middlewares/authMiddleware");
const logger = require("../services/middlewares/logger");

router.post(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.createNewSubscription
);
router.delete(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.removeUserFromSubscription
);

module.exports = router;
