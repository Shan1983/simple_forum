const express = require("express");
const router = express.Router();

const controller = require("../controllers/report");
const middleware = require("../services/middlewares/authMiddleware");
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
  controller.getReports
);

router.post(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.createNewReport
);

router.post(
  "/:threadId/:postId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.createNewReport
);

router.delete(
  "/:reportId",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.removeReport
);

module.exports = router;
