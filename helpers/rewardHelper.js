const { Rewards } = require("../models");
const attributes = require("./getModelAttributes");

exports.intialRewardsSetup = async () => {
  // initial settings setup
  const data = {
    pointsPerPost: 20,
    pointsPerThread: 20,
    pointsPerLike: 20,
    pointsPerBestPost: 50,
    pointsForAdvertising: 1000,
    pointsPerPollQuestion: 20,
    pointsPerPollVote: 20
  };

  const rewards = await Rewards.findById(1);
  const rewardReq = attributes.convert(rewards);
  if (!rewardReq.init) {
    await Rewards.initialSetup();
  }

  return data;
};
