const { Ban, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

exports.addBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      const userReq = attributes.convert(user);
      if (Ban.checkIfBanned(userReq)) {
        await Ban.banUser(req.body.userId, req.ip, req.body.reason);
        // send email explaining the reason of the banning
        // and their options of having the decision reversed..

        res.json({ success: true });
      } else {
        res.status(400);
        res.json({ error: [errors.banError] });
      }
    }
  } catch (error) {
    next(errors);
  }
};
exports.removeBan = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      const userReq = attributes.convert(user);
      if (Ban.checkIfBanned(userReq)) {
        await Ban.unbanUser(userReq.id);

        // send email explaining that the ban has been lifted

        res.json({ success: true });
      } else {
        res.status(400);
        res.json({ error: [errors.banError] });
      }
    }
  } catch (error) {
    next(errors);
  }
};
