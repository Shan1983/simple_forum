const {
  User,
  Post,
  Thread,
  Category,
  Sequelize,
  Log,
  Rewards
} = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");
const penalty = require("../../helpers/pentalybox");
const subscriber = require("../../services/subscriptions/subs");

// "/:threadId",
exports.newPost = async (req, res, next) => {
  try {
    await penalty.penaltyDuration(req);
    const thread = await Thread.findById(req.params.threadId);

    const threadReq = attributes.convert(thread);

    if (await penalty.penaltyCanCreatePost(req)) {
      if (!thread) {
        next(errors.threadError);
      } else if (threadReq.locked) {
        next(errors.lockedError);
      } else {
        const discussion = req.body.discussion;

        await Post.create({
          discussion,
          UserId: req.session.userId,
          ThreadId: req.params.threadId
        });

        const user = await User.findById(req.session.userId);
        const userReq = await attributes.convert(user);
        //   const rewards = await Rewards.findAll({
        //     attributes: ["pointsPerPost"]
        //   });

        //   // fix this when u work on settings
        //   const points = rewards.toJSON();

        await user.increment("postCount", { by: 1 });
        await user.increment("points", { by: req.app.locals.pointsPerPost });
        //   await rewards.increment("points", { by: points.pointsPerPost });

        const subsObj = {
          name: userReq.username,
          threadId: req.params.threadId,
          discussion: discussion
        };

        await subscriber.checkSubsAndSendNewMessage(subsObj);

        res.json({ success: true });
      }
    } else {
      next(errors.penaltyError);
    }
  } catch (error) {
    next(error);
  }
};
//   "/:postId/best",
// can only be done by the OP
exports.markAsBest = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      next(errors.postError);
    } else {
      const postReq = attributes.convert(post);

      if (req.session.userId !== postReq.UserId) {
        next(errors.notAuthorized);
      } else {
        await Post.markAsBest(postReq.id);

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId/:postId/quote
exports.quote = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      next(errors.postError);
    } else {
      // get the thread and check if it exists
      const thread = await Thread.findById(req.params.threadId);

      if (!thread) {
        next(errors.threadError);
      } else {
        const threadReq = attributes.convert(thread);
        const { discussion } = req.body;

        // create a post with the added quote
        await Post.create({
          UserId: req.session.userId,
          ThreadId: threadReq.id,
          discussion: `<blockquote>${threadReq.discussion}</blockquote>
          <hr/>
          ${discussion}`
        });

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};
// "/:postId",
// must be OP
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      next(errors.postError);
    } else {
      const postReq = attributes.convert(post);
      if (req.session.userId === postReq.UserId) {
        post.update({
          discussion: req.body.discussion
        });
        res.json({ success: true });
      } else {
        next(errors.notAuthorized);
      }
    }
  } catch (error) {
    next(error);
  }
};
//   "/:postId",
// must be admin
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      next(errors.postError);
    } else {
      await post.destroy();

      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
