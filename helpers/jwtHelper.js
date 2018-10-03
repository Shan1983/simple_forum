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
  async generateNewToken(user) {
    const now = new Date().getTime() / 1000;
    const tomorrow = 86400;

    const role = await user.getRoles();

    return jwt.sign(
      {
        iss: "localhost",
        sub: { id: user.id, username: user.username, role },
        exp: tomorrow,
        iat: now
      },
      process.env.JWT_SECRET
    );
  },
  /**
   * Returns a users role
   * @param {Request} req
   * @param {String} token
   * @returns {string}
   */
  getUserRole(token) {
    const decoded = jwt.verify(token, this.getJwtSecret());
    if (!decoded) {
      throw errors.parameterError("token", "We could not decode the token.");
    } else {
      console.log("passed the token");
      return decoded.sub.role;
    }
  }
};
