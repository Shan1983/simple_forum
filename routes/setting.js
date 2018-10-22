const express = require("express");
const router = express.Router();

const middelware = require("../services/middlewares/authMiddleware");
const controller = require("../controllers/setting");

module.exports = router;
