const passport = require("passport");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const errors = require("./mainErrors");

module.exports = {
  /**
   * Returns the JWT secret
   */
  getJwtSecret() {
    return process.env.JWT_SECRET;
  },
  /**
   * Creates a new token
   * @param {Model} user
   */
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
  },
  getUserRole(req, token) {
    if (req.session.admin) {
      const decoded = jwt.verify(token, this.getJwtSecret);
      if (!decoded) {
        throw errors.parameterError("token", "We could not decode the token.");
      } else {
        console.log("passed the token");
        return decoded.sub.role;
      }
    } else {
      throw errors.notAuthorized;
    }
  }
};
