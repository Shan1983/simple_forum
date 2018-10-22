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
exports.setupUserSession = (req, res, username, userId, role, token) => {
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
    res.cookie("UIadmin", true);
  }

  /**
   * Sets the session depending on user role.
   */
  switch (role) {
    case "System":
      req.session.role = "System";
      break;
    case "Admin":
      req.session.role = "Admin";
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

  // save the token to a cookie
  // for testing..
  // this should be saved to local storage on the client

  res.cookie("token", token);
};
