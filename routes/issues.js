const express = require("express");
const router = express.Router();

const middleware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/issue");
const logger = require("../services/middlewares/logger");

router.get(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.getAllIssues
);

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.newIssue
);

router.put(
  "/:issue",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.editIssue
);

router.delete(
  "/:issue",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.removeIssue
);

module.exports = router;
