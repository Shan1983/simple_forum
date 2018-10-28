const { Subscription, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

// create a new subscription
// /:threadId
exports.createNewSubscription = async (req, res, next) => {
  try {
    // check if the user has email subs turn on
    const user = await User.findById(req.session.userId);
    const userReq = await attributes.convert(user);

    if (userReq.emailSubscriptions) {
      const sub = await Subscription.create({
        ThreadId: req.params.threadId,
        UserId: req.session.userId,
        sendEmails: true
      });

      if (!sub) {
        next(errors.subscriptionError);
      } else {
        res.json({ success: true });
      }
    } else {
      next(errors.subscriptionEmailError);
    }
  } catch (error) {
    next(error);
  }
};

// remove a user from the subscription list
// /:threadId
exports.removeUserFromSubscription = async (req, res, next) => {
  try {
    await Subscription.destroy({
      where: { UserId: req.session.userId, ThreadId: req.params.threadId }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
