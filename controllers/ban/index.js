const { Ban, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const jwtHelper = require("../../helpers/jwtHelper");

exports.addBan = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
      if (req.session.role !== "Admin") {
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
      } else {
        const user = await User.findById(req.body.userId);

        if (!user) {
          res.status(400);
          res.json({ error: [errors.accountNotExists] });
        } else {
          await Ban.banUser(req.body.userId, req.ip, req.body.reason);
          // send email explaining the reason of the banning
          // and their options of having the decision reversed..

          res.json({ success: true });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.status(400);
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(errors);
  }
};
exports.removeBan = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      if (req.session.role !== "Admin") {
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
      } else {
        const { email } = req.body;

        const user = await User.findOne({
          where: { email }
        });

        if (!user) {
          res.status(400);
          res.json({ error: [errors.accountNotExists] });
        } else {
          const userAttributes = user.getAttributes(user);

          await Ban.unbanUser(userAttributes.id);

          // send email explaining that the ban has been lifted

          res.json({ success: true });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.status(400);
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(errors);
  }
};
