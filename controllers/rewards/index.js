const { Rewards } = require("../../models");

exports.getRewards = async (req, res) => {
  res.json({
    pointsPerPost: req.app.locals.pointsPerPost,
    pointsPerThread: req.app.locals.pointsPerThread,
    pointsPerLike: req.app.locals.pointsPerLike,
    pointsPerBestPost: req.app.locals.pointsPerBestPost,
    pointsForAdvertising: req.app.locals.pointsForAdvertising,
    pointsPerPollQuestion: req.app.locals.pointsPerPollQuestion,
    pointsPerPollVote: req.app.locals.pointsPerPollVote
  });
};

exports.postRewards = async (req, res, next) => {
  try {
    const {
      pointsPerPost,
      pointsPerThread,
      pointsPerLike,
      pointsPerBestPost,
      pointsForAdvertising,
      pointsPerPollQuestion,
      pointsPerPollVote
    } = req.body;

    await Rewards.update(
      {
        pointsPerPost,
        pointsPerThread,
        pointsPerLike,
        pointsPerBestPost,
        pointsForAdvertising,
        pointsPerPollQuestion,
        pointsPerPollVote
      },
      { where: { id: 1 } }
    );

    req.app.locals.pointsPerPost = pointsPerPost;
    req.app.locals.pointsPerThread = pointsPerThread;
    req.app.locals.pointsPerLike = pointsPerLike;
    req.app.locals.pointsPerBestPost = pointsPerBestPost;
    req.app.locals.pointsForAdvertising = pointsForAdvertising;
    req.app.locals.pointsPerPollQuestion = pointsPerPollQuestion;
    req.app.locals.pointsPerPollVote = pointsPerPollVote;

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
