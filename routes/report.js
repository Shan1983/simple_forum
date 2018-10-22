const express = require("express");
const router = express.Router();

const controller = require("../controllers/report");
const middleware = require("../services/middlewares/authMiddleware");

router.get(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.getReports
);

router.post(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.createNewReport
);

router.post(
  "/:threadId/:postId",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.createNewReport
);

router.delete(
  "/:reportId",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.removeReport
);

module.exports = router;
