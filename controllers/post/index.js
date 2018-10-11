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
const jwtHelper = require("../../helpers/jwtHelper");

// "/:threadId",
exports.newPost = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      const thread = await Thread.findById(req.params.threadId);

      const attr = thread.getAttributes(thread);

      if (!thread) {
        res.status(400);
        res.json({ error: [errors.threadError] });
      } else if (attr.locked) {
        res.status(400);
        res.json({ error: [errors.lockedError] });
      } else {
        const discussion = req.body.discussion;

        await Post.create({
          discussion,
          UserId: req.session.userId,
          ThreadId: req.params.threadId
        });

        const user = await User.findById(req.session.userId);
        //   const rewards = await Rewards.findAll({
        //     attributes: ["pointsPerPost"]
        //   });

        //   // fix this when u work on settings
        //   const points = rewards.toJSON();

        await user.increment("postCount", { by: 1 });
        //   await rewards.increment("points", { by: points.pointsPerPost });

        res.json({ success: true });
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
//   "/:postId/best",
// can only be done by the OP
exports.markAsBest = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        res.status(400);
        res.json({ error: [errors.postError] });
      } else {
        const attributes = post.getAttributes(post);

        if (req.session.userId !== attributes.UserId) {
          res.status(401);
          res.json({ error: [errors.notAuthorized] });
        } else {
          await Post.markAsBest(attributes.id);

          res.json({ success: true });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId/:postId/quote
exports.quote = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        res.status(400);
        res.json({ error: [errors.postError] });
      } else {
        // get the post to be quoted
        const quote = post.getAttributes(post);

        // get the thread and check if it exists
        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
          res.status(400);
          res.json({ error: [errors.threadError] });
        } else {
          const threadAttributes = thread.getAttributes(thread);
          const { discussion } = req.body;

          // create a post with the added quote
          await Post.create({
            UserId: req.session.userId,
            ThreadId: threadAttributes.id,
            discussion: `<blockquote>${threadAttributes.discussion}</blockquote>
          <hr/>
          ${discussion}`
          });

          res.json({ success: true });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
// "/:postId",
// must be OP
exports.updatePost = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        res.status(400);
        res.json({ error: [errors.postError] });
      } else {
        const postAttr = post.getAttributes(post);
        if (req.session.userId === postAttr.UserId) {
          post.update({
            discussion: req.body.discussion
          });
          res.json({ success: true });
        } else {
          res.status(401);
          res.json({ error: [errors.notAuthorized] });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
//   "/:postId",
// must be admin
exports.deletePost = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        res.status(400);
        res.json({ error: [errors.postError] });
      } else {
        if (req.session.role !== "Admin") {
          res.status(401);
          res.json({ error: [errors.notAuthorized] });
        } else {
          await post.destroy();

          res.json({ success: true });
        }
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
