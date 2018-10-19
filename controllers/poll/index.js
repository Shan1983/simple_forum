const errors = require("../../helpers/mainErrors");
const {
  User,
  Thread,
  PollQuestion,
  PollVote,
  PollResponse
} = require("../../models");
const attributes = require("../../helpers/getModelAttributes");
const validate = require("../../helpers/validation");

// /:pollId
exports.getAPoll = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
// /all
exports.getAllPolls = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
// /:threadId/new
exports.newPoll = async (req, res, next) => {
  try {
    const thread = await Thread.findOne({ where: { id: req.params.threadId } });

    if (!thread) {
      res.status(400);
      res.json({ error: [errors.threadError] });
    } else {
      const question = req.body.question;
      const responses = req.body.responses;

      // response validation
      if (responses.length < 2) {
        res.status(400);
        res.json({ error: [errors.pollResponseError] });
      } else if (responses.length !== new Set(responses).size) {
        res.status(400);
        res.json({ error: [errors.pollResponseDuplicates] });
      } else if (validate.isEmpty(question)) {
        res.status(400);
        res.json({ error: [errors.pollQuestionError] });
      } else {
        // lets create a new poll

        // create the poll question
        const pollQuestion = await PollQuestion.create({
          question,
          UserId: req.session.userId,
          duration: req.body.duration
        });

        const questionReq = attributes.convert(pollQuestion);

        // add the polls responses

        await Promise.all(
          responses.map(r =>
            PollResponse.create({
              response: r,
              PollQuestionId: questionReq.id
            })
          )
        );

        // add the poll to the thread
        const threadReq = attributes.convert(thread);
        await Thread.update(
          { PollQuestionId: questionReq.id },
          {
            where: {
              id: threadReq.id
            }
          }
        );

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:pollId/vote
exports.voteOnPoll = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// /:pollId
exports.editPoll = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
// /:pollId/remove
exports.removePoll = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
