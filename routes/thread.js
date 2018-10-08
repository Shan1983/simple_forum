const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers/thread");

router.post(
  "/:category/",
  passport.authenticate("jwt", { session: false }),
  controller.postNewThread
);

router.post(
  "/:threadId/lock",
  passport.authenticate("jwt", { session: false }),
  controller.lockThread
);

router.post(
  "/:threadId/make-sticky",
  passport.authenticate("jwt", { session: false }),
  controller.stickyThread
);

router.post(
  "/:threadId/move",
  passport.authenticate("jwt", { session: false }),
  controller.moveThread
);

router.get(
  "/:threadId",
  passport.authenticate("jwt", { session: false }),
  controller.getThread
);

router.get(
  "/:categoryId/deleted/threads",
  passport.authenticate("jwt", { session: false }),
  controller.getDeletedThreads
);

router.put(
  "/:threadId",
  passport.authenticate("jwt", { session: false }),
  controller.updateThread
);

router.delete(
  "/:threadId",
  passport.authenticate("jwt", { session: false }),
  controller.deleteThread
);
module.exports = router;
