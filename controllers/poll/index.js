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
const moment = require("moment");

// /:pollId
exports.getAPoll = async (req, res, next) => {
  try {
    const pollQuestion = await PollQuestion.findById(req.params.pollId);

    if (!pollQuestion) {
      next(errors.pollError);
    } else {
      const pollQuestionReq = attributes.convert(pollQuestion);

      // check if the polls active
      if (pollQuestionReq.active === false) {
        next(errors.pollEndedError);
      } else {
        // check if the polls been open for 7 days
        const days = moment(pollQuestionReq.createdAt).fromNow();

        if (days >= 7) {
          await PollQuestion.update(
            { active: true },
            { where: { id: pollQuestionReq.id } }
          );
        }

        // get the questiosn responses
        const pollResponses = await PollResponse.findAll({
          where: { PollQuestionId: pollQuestionReq.id }
        });

        const result = pollResponses.map(f => {
          return f.response;
        });

        Promise.all(result).then(complete => {
          res.json({
            poll: {
              question: pollQuestionReq.question,
              responses: complete,
              results: pollQuestionReq.PollVotes
            }
          });
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /all
exports.getAllPolls = async (req, res, next) => {
  try {
    const polls = await PollQuestion.findAndCountAll();
    res.json(polls);
  } catch (error) {
    next(error);
  }
};
// /:pollId/result
exports.generatePollResults = async (req, res, next) => {
  try {
    const results = await PollVote.findAndCountAll({
      where: { PollQuestionId: req.params.pollId }
    });

    const question = await PollQuestion.findById(req.params.pollId);
    const questionReq = attributes.convert(question);

    const count = results.rows.reduce((sum, row) => {
      sum[row.PollResponseId] = (sum[row.PollResponseId] || 0) + 1;
      return sum;
    }, {});

    const resultObj = {
      total: results.count,
      questionId: questionReq.id,
      results: count
    };

    res.json(resultObj);
  } catch (error) {
    next(error);
  }
};
// /:threadId/new
exports.newPoll = async (req, res, next) => {
  try {
    const thread = await Thread.findOne({
      where: { id: req.params.threadId }
    });

    if (!thread) {
      next(errors.threadError);
    } else {
      const question = req.body.question;
      const responses = req.body.responses;

      // response validation
      if (responses.length < 2) {
        next(errors.pollResponseError);
      } else if (responses.length !== new Set(responses).size) {
        next(errors.pollResponseDuplicates);
      } else if (validate.isEmpty(question)) {
        next(errors.pollQuestionError);
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

        const user = await User.findById(req.session.userId);
        await user.increment("points", {
          by: req.app.locals.pointsPerPollVote
        });

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:pollId/:responseId/vote
exports.voteOnPoll = async (req, res, next) => {
  try {
    // get the poll question
    const poll = await PollQuestion.findById(req.params.pollId);
    if (!poll) {
      next(errors.pollError);
    } else {
      const pollReq = attributes.convert(poll);
      // check if the user has already voted
      const votes = await PollVote.findAll({
        where: { UserId: req.session.userId }
      });

      let error = false;
      votes.map(v => {
        if (v.UserId === req.session.userId) {
          error = true;
        }
      });

      if (error) {
        next(errors.pollAlreadyVotedError);
      } else {
        // record the users vote
        await PollVote.create({
          UserId: req.session.userId,
          PollQuestionId: pollReq.id,
          PollResponseId: req.params.responseId
        });

        const user = await User.findById(req.session.userId);
        await user.increment("points", {
          by: req.app.locals.pointsPerPollVote
        });
        // return response message
        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:pollId
exports.editPoll = async (req, res, next) => {
  try {
    const poll = await PollQuestion.findOne({
      where: { id: req.params.pollId }
    });

    if (!poll) {
      next(errors.pollError);
    } else {
      const question = req.body.question;
      const responses = req.body.responses;

      // response validation
      if (responses.length < 2) {
        next(errors.pollResponseError);
      } else if (responses.length !== new Set(responses).size) {
        next(errors.pollResponseDuplicates);
      } else if (validate.isEmpty(question)) {
        next(errors.pollQuestionError);
      } else {
        // update a poll

        // update the poll's question
        const pollQuestion = await PollQuestion.update(
          {
            question,
            UserId: req.session.userId
          },
          { where: { id: req.params.pollId } }
        );

        const questionReq = attributes.convert(pollQuestion);

        // update the polls responses
        await Promise.all(
          responses.map((r, i) => {
            return PollResponse.update(
              {
                response: r,
                PollQuestionId: questionReq.id
              },
              { where: { id: ++i } }
            );
          })
        );

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:pollId/remove
exports.removePoll = async (req, res, next) => {
  try {
    // find poll
    const poll = await PollQuestion.findById(req.params.pollId);
    const pollReq = attributes.convert(poll);

    // remove votes
    await PollVote.destroy({
      where: { PollQuestionId: pollReq.id }
    });

    // remove responses
    await PollResponse.destroy({
      where: { PollQuestionId: pollReq.id }
    });

    // remove question
    await PollQuestion.destroy({
      where: { id: pollReq.id }
    });

    // return response
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
