const express = require("express");
const router = express.Router();

const controller = require("../controllers/rewards");
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
  middleware.isLeader,
  controller.getRewards
);

router.post(
  "/",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.postRewards
);

module.exports = router;
