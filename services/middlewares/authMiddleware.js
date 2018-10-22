const passport = require("passport");
const errors = require("../../helpers/mainErrors");
const jwtHelper = require("../../helpers/jwtHelper");

/**
 * A series of middlewares that check if the user is authenticated,
 * and acts in a certain role
 */

// checks if a user is authenticated, if there is any issues then they are returned
// as a security measure all issues return 401 unauthorized.
exports.isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (info) {
      res.status(401);
      return res.json({
        error: [info.name, info.message]
      });
    }

    if (!user) {
      res.status(401);
      return res.json({ error: [errors.notAuthorized] });
    }
    return next();
  })(req, res, next);
};

// This middleware is used on routes that only an admin can
// access, such as settings, and deleting based routes
exports.isAdmin = (req, res, next) => {
  if (req.session.role === "Admin") {
    return next();
  } else {
    res.status(401);
    res.json({ error: [errors.notAuthorized] });
  }
};

// This middleware allows both moderators and admins
// to access the route
exports.isLeader = (req, res, next) => {
  if (req.session.role !== "Member") {
    return next();
  } else {
    res.status(401);
    res.json({ error: [errors.notAuthorized] });
  }
};

exports.canContinue = (req, res, next) => {
  const token = req.cookies.token;
  const decodedToken = jwtHelper.decodeJwt(token);

  if (decodedToken.username === req.session.username) {
    return next();
  } else {
    res.status(401);
    // file a report on the user trying to do something out of the norm
    // grab their ip address
    // sign them out
    // destroy any sessions
    // send them to a warning page
    // res.redirect("/views/warning/activity");
    res.json({ error: [errors.notAuthorized] });
  }
};
