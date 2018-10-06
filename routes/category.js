const express = require("express");
const passport = require("passport");
const router = express.Router();

const controller = require("../controllers/category/category");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getCategory
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.newCategory
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.updateCategory
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.deleteCategory
);

module.exports = router;
