const express = require("express");
const router = express.Router();

const controller = require("../controllers/user/root");

router.get("/", controller.root);

module.exports = router;
