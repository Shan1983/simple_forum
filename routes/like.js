const express = require("express");
const router = express.Router();

const controller = require("../controllers/like");
const middleware = require("../services/middlewares/authMiddleware");

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.addThreadLike
);

router.delete(
  "/remove",
  middleware.isAuthenticated,
  middleware.canContinue,
  controller.removeLike
);

module.exports = router;
