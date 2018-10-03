/**
 * this sets up the internal session for the user.
 * This session will be checked
 * against incoming traffic to test is the incoming request
 * is actually valid.
 * @param {Object} req
 * @param {Object} res
 * @param {String} username
 * @param {Integer} userId
 * @param {Object} role
 */
exports.setupUserSession = (req, res, username, userId, role) => {
  /**
   * set the sessions
   */
  req.session.loggedIn = true;
  req.session.username = username;
  req.session.userId = userId;

  /**
   * set a cookie for the username
   */
  res.cookie("username", username);

  /**
   * set a cookie for displaying certain UI elments
   * this is NOT a security measure! ALL request
   * with a users role will be server side validated.
   * Therefore even if a user sees a Admin UI element,
   * they will not be able to access that route.
   */
  if (role !== "Member") {
    res.cookie("UIadmin", !!role.admin); // !! coerces to boolean
  }

  /**
   * Sets the session depending on user role.
   */
  switch (role) {
    case "System":
      req.session.role = "System";
      break;
    case "Administrator":
      req.session.role = "Admininstrator";
      break;
    case "Moderator":
      req.session.role = "Moderator";
      break;
    case "Member":
      req.session.role = "Member";
      break;
    default:
      return null;
  }
};
