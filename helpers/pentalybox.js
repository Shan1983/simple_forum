const moment = require("moment");
const { PenaltyBox } = require("../models");
const attributes = require("./getModelAttributes");

exports.isUserInPenaltyBox = async (id, req) => {
  // set sessions depending if a user is in the box
  const user = await PenaltyBox.findOne({
    where: { UserId: id }
  });

  // if a user is in the box,
  // find out what they can do and how long theyre in there for.
  if (user) {
    const userReq = attributes.convert(user);
    req.session.penalty = true;

    req.session.canCreateThread = userReq.userCanCreateThread;
    req.session.canCreatePost = userReq.userCanCreatePost;
    req.session.penaltyDuration = userReq.duration;
    req.session.penaltyCreatedAt = userReq.createdAt;
  } else {
    req.session.penalty = false;
  }
};

exports.penaltyDuration = async req => {
  // if a user is in the box calculate the time
  // and remove them if their time is up
  if (req.session.penalty) {
    const created = moment(req.session.createdAt);
    const result = moment().isAfter(created);

    if (result) {
      await PenaltyBox.destroy({ where: { UserId: req.session.userId } });
      return true;
    }
  }

  return false;
};

exports.penaltyCanCreateThread = async req => {
  if (req.session.canCreateThread) {
    return false;
  } else {
    return true;
  }
};

exports.penaltyCanCreatePost = async req => {
  if (req.session.canCreatePost) {
    return false;
  } else {
    return true;
  }
};
