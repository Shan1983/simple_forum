const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers/category/category");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAllCategory
);

router.get(
  "/:id/threads",
  passport.authenticate("jwt", { session: false }),
  controller.getAllThreadsInCategory
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.newCategory
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateCategory
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteCategory
);

module.exports = router;
