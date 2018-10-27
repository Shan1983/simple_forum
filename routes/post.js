const express = require("express");
const router = express.Router();
const middleware = require("../services/middlewares/authMiddleware");

const controller = require("../controllers/post");
const limitr = require("../services/middlewares/ratelimit");
const logger = require("../services/middlewares/logger");

router.all("*", (req, res, next) => {
  if (req.app.locals.maintenance || req.app.locals.lockForum) {
    res.status(503);
    res.json({ status: 503 });
  } else {
    next();
  }
});

router.post(
  "/:threadId",
  middleware.isAuthenticated,
  middleware.canContinue,
  limitr,
  logger.general,
  controller.newPost
);

router.post(
  "/:postId/best",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.markAsBest
);

router.post(
  "/:threadId/:postId/quote",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.quote
);

router.put(
  "/:postId",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.updatePost
);

router.delete(
  "/:postId",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.deletePost
);

module.exports = router;
