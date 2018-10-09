const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/post");

router.post(
  "/:threadId",
  passport.authenticate("jwt", { session: false }),
  controller.newPost
);
router.post(
  "/:postId/best",
  passport.authenticate("jwt", { session: false }),
  controller.markAsBest
);

router.post(
  "/:threadId/:postId/quote",
  passport.authenticate("jwt", { session: false }),
  controller.quote
);
router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  controller.updatePost
);
router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  controller.deletePost
);

module.exports = router;
