const { Subscription, Thread } = require("../../models");
const attributes = require("../../helpers/getModelAttributes");
const emailer = require("../emails/send");

// on each new forum post check the subscription list and send the new post
exports.checkSubsAndSendNewMessage = async data => {
  const subs = await Subscription.findAll({ where: { sendEmails: true } });
  const thread = await Thread.findById(data.threadId);
  const threadReq = await attributes.convert(thread);
  // send the new post to everyone subscribed
  subs.map(async () => {
    const subObj = {
      template: "subscription",
      name: data.name,
      siteName: process.env.SITE_NAME,
      thread: threadReq.title,
      discussion: data.post
    };

    // send the email
    emailer.sendEmail(subObj);
  });
};
