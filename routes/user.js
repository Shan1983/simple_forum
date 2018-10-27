const express = require("express");
const router = express.Router();
const uuidv5 = require("uuid/v5");
const multer = require("multer");

const controller = require("../controllers/user");
const middleware = require("../services/middlewares/authMiddleware");
const logger = require("../services/middlewares/logger");

const storage = multer.diskStorage({
  destination: "/uploads/",
  filename: (req, file, cb) => {
    const filename = file.originalname;

    const finalFileName = `${uuidv5(filename, uuidv5.DNS)}${filename}`;

    cb(null, finalFileName);
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 1000000 } });

router.post("/login", logger.general, controller.login);

router.all("*", (req, res, next) => {
  if (req.app.locals.maintenance || req.app.locals.lockForum) {
    res.status(503);
    res.json({ status: 503 });
  } else {
    next();
  }
});

router.get(
  "/all",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  logger.general,
  controller.getAllUsers
);

router.get(
  "/:username",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.getUserMeta
);
router.get(
  "/profile/:username",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.userProfile
);

router.get("/:username/avatar", logger.general, controller.getAvatar);

router.post("/register", logger.general, controller.register);

router.post("/logout", logger.general, controller.logout);

router.post(
  "/profile/:username/upload",
  middleware.isAuthenticated,
  middleware.canContinue,
  upload.single("avatar"),
  logger.general,
  controller.upload
);

router.put(
  "/profile/:username",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.updateProfile
);

// soft deletes account
router.delete(
  "/profile/:username/close",
  middleware.isAuthenticated,
  middleware.canContinue,
  logger.general,
  controller.closeAccount
);

// perminately deletes a users account - requires admin
router.delete(
  "/profile/:username",
  middleware.isAuthenticated,
  middleware.canContinue,
  middleware.isAdmin,
  logger.general,
  controller.deleteUser
);

// TEMPORARY EMAIL VERIFICATION ROUTE
router.get("/verify/email/:token", logger.general, controller.verifyEmail);

module.exports = router;
