// this sets up the internal session for the user. This session will be checked
// against incoming traffic to test is the incoming request is actually valid.
exports.setupUserSession = (req, res, username, userId, role) => {
  // set the sessions
  req.session.loggedIn = true;
  req.session.username = username;
  req.session.userId = userId;

  // set a cookie for the username
  res.cookie("username", username);

  // set a cookie for displaying certain UI elments
  // this is NOT a security measure! ALL request
  // with a users role will be server side validated.
  // Therefore even if a user sees a Admin UI element,
  // they will not be able to access that route.
  res.cookie("admin", !!role.admin); // !! coerces to boolean

  // set the session depending on a users role
  switch (role) {
    case "System":
      req.session.System;
      break;
    case "Administrator":
      req.session.Admin;
      break;
    case "Moderator":
      req.session.Moderator;
      break;
    default:
      return null;
  }
};
