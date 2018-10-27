const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers/category/index.js");
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
  logger.general,
  controller.getAllCategory
);

router.get(
  "/:id/threads",
  middleware.isAuthenticated,
  middleware.isAdmin,
  logger.general,
  controller.getAllThreadsInCategory
);

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  logger.general,
  controller.newCategory
);

router.put(
  "/:id",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  logger.general,
  controller.updateCategory
);

router.delete(
  "/:id",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  logger.general,
  controller.deleteCategory
);

module.exports = router;
