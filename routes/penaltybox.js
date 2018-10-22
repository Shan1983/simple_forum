const express = require("express");
const router = express.Router();

const middleware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/penaltybox");

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
