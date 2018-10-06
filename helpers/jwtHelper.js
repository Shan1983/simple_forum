const passport = require("passport");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const { Role, UserRole } = require("../models");

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
    // get the users role

    const roleRecord = await UserRole.findById(user.id);

    const roleResult = await Role.findById(roleRecord.RoleId);

    const role = roleResult.toJSON().role;

    const exp = 3600;

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: exp
      }
    );
  },
  /**
   * Returns a users role
   * @param {Request} req
   * @param {String} token
   * @returns {string}
   */
  async getUserRole(user) {
    const roleRecord = await UserRole.findById(user.id);

    const roleResult = await Role.findById(roleRecord.RoleId);

    const role = roleResult.toJSON().role;

    return role;
  },

  decodeJwt(token) {
    const decoded = jwt.verify(token, this.getJwtSecret());
    if (!decoded) {
      throw errors.parameterError("token", "We could not decode the token.");
    } else {
      return decoded;
    }
  }
};
