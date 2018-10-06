const express = require("express");
const passport = require("passport");
const router = express.Router();
const uuidv5 = require("uuid/v5");

const multer = require("multer");

const controller = require("../controllers/user/user");

const storage = multer.diskStorage({
  destination: __dirname + "/uploads/",
  filename: (req, file, cb) => {
    const filename = file.originalname;

    const finalFileName = `${uuidv5(filename, uuidv5.DNS)}${filename}`;

    cb(null, finalFileName);
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 1000000 } });

router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ success: 200 });
  }
);

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  controller.getAllUsers
);
router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  controller.getUserMeta
);
router.get(
  "/profile/:username",
  passport.authenticate("jwt", { session: false }),
  controller.userProfile
);

router.get("/:username/avatar", controller.getAvatar);

router.post("/login", controller.login);
router.post("/register", controller.register);

router.post("/logout", controller.logout);

router.post(
  "/profile/:username/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  controller.upload
);

router.put(
  "/profile/:username",
  passport.authenticate("jwt", { session: false }),
  controller.updateProfile
);

// soft deletes account
router.delete(
  "/profile/:username/close",
  passport.authenticate("jwt", { session: false }),
  controller.closeAccount
);

// perminately deletes a users account - requires admin
router.delete(
  "/profile/:username",
  passport.authenticate("jwt", { session: false }),
  controller.deleteUser
);

// TEMPORARY EMAIL VERIFICATION ROUTE
router.get("/verify/email/:token", controller.verifyEmail);

module.exports = router;
