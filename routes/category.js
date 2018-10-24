const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers/category/index.js");
const middleware = require("../services/middlewares/authMiddleware");

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
  controller.getAllCategory
);

router.get(
  "/:id/threads",
  middleware.isAuthenticated,
  middleware.isAdmin,
  controller.getAllThreadsInCategory
);

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.newCategory
);

router.put(
  "/:id",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.updateCategory
);

router.delete(
  "/:id",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.deleteCategory
);

module.exports = router;
