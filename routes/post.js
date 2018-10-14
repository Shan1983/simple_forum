const express = require("express");
const router = express.Router();
const middleware = require("../services/middlewares/authMiddleware");

const controller = require("../controllers/post");
const limitr = require("../services/middlewares/ratelimit");

router.post(
  "/:threadId",
  middleware.isAuthenticated,
  limitr,
  controller.newPost
);

router.post("/:postId/best", middleware.isAuthenticated, controller.markAsBest);

router.post(
  "/:threadId/:postId/quote",
  middleware.isAuthenticated,
  controller.quote
);

router.put("/:postId", middleware.isAuthenticated, controller.updatePost);

router.delete(
  "/:postId",
  middleware.isAuthenticated,
  middleware.isLeader,
  controller.deletePost
);

module.exports = router;
