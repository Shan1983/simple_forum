const passport = require("passport");
const jwt = require("jsonwebtoken");
const moment = require("moment");

module.exports = {
  getJwtSecret() {
    return process.env.JWT_SECRET;
  },
  generateNewToken(user) {
    const now = moment();
    const tomorrow = moment().add(1, "days");

    return jwt.sign({
      iss: "localhost",
      sub: {
        id: user.id,
        username: user.username,
        role: user.Role.role
      },
      exp: tomorrow,
      iat: now
    });
  }
};
