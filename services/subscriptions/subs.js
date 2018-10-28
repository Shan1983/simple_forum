const { Subscription, Thread, User } = require("../../models");
const attributes = require("../../helpers/getModelAttributes");
const emailer = require("../emails/send");

// on each new forum post check the subscription list and send the new post
exports.checkSubsAndSendNewMessage = async data => {
  const subs = await Subscription.findAll({ where: { sendEmails: true } });

  // send the new post to everyone subscribed

  let subObj = {};
  subs.map(async s => {
    const thread = await Thread.findById(s.ThreadId);
    const user = await User.findById(s.UserId);
    const threadReq = await attributes.convert(thread);
    const userReq = await attributes.convert(user);

    subObj = {
      template: "subscription",
      to: userReq.email,
      name: userReq.username,
      siteName: process.env.SITE_NAME,
      threadTitle: threadReq.title,
      discussion: data
    };
    // send the email
    emailer.sendEmail(subObj);
  });
};
