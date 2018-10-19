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
    const pollQuestion = await PollQuestion.findById(req.params.pollId);

    if (!pollQuestion) {
      res.status(400);
      res.json({ error: [errors.pollError] });
    } else {
      const pollQuestionReq = attributes.convert(pollQuestion);
      console.log(pollQuestionReq);
      // get the questiosn responses
      const pollResponses = await PollResponse.findAll({
        where: { PollQuestionId: pollQuestionReq.id }
      });

      console.log(pollResponses);

      const result = pollResponses.map(f => {
        return f.response;
      });

      console.log(result);

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

// /:pollId/:responseId/vote
exports.voteOnPoll = async (req, res, next) => {
  try {
    // get the poll question
    const poll = await PollQuestion.findById(req.params.pollId);
    const pollReq = attributes.convert(poll);
    // check if the user has already voted
    const vote = await PollVote.findById(req.session.userId);
    const voteReq = attributes.convert(vote);
    if (voteReq.UserId === req.session.userId) {
      res.status(400);
      res.json({ error: [errors.pollAlreadyVotedError] });
    } else {
      // record the users vote
      await PollVote.create({
        UserId: req.session.userId,
        PollQuestionId: pollReq.id,
        PollResponseId: req.params.responseId
      });
      // return response message
      res.json({ success: true });
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
      res.status(400);
      res.json({ error: [errors.pollError] });
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
