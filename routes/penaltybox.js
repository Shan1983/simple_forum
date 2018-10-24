const express = require("express");
const router = express.Router();

const middleware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/penaltybox");

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
  controller.getAllInBox
);

router.post(
  "/:userId",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isLeader,
  controller.putAUserInTheBox
);

router.delete(
  "/:userId",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  controller.removeAUserFromBox
);

module.exports = router;
