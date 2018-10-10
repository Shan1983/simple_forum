const { Thread, Post, Like, User } = require("../../models");

exports.addLike = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
exports.removeLike = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
