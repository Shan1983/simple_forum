const jwt = require("jsonwebtoken");

const attributes = require("./getModelAttributes");

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

    const role = await attributes.getUserRole(user);

    const exp = 3600; // 1 hour

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

  decodeJwt(token) {
    const decoded = jwt.verify(token, this.getJwtSecret());
    return decoded;
  }
};
