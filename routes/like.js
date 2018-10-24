const express = require("express");
const router = express.Router();

const controller = require("../controllers/like");
const middleware = require("../services/middlewares/authMiddleware");

router.all("*", (req, res, next) => {
  if (req.app.locals.maintenance || req.app.locals.lockForum) {
    res.status(503);
    res.json({ status: 503 });
  } else {
    next();
  }
});

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
