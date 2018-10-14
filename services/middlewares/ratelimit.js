const rateLimit = require("express-rate-limit");

// get the real values from settings db
const postLimitr = rateLimit({
  windowMs: 5000, // 5 seconds
  max: 2,
  message: "Please wait a few moments before posting again."
});

module.exports = postLimitr;
