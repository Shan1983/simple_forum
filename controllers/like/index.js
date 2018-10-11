const { Thread, Post, Like, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const jwtHelper = require("../../helpers/jwtHelper");

exports.addThreadLike = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
      const { threadId, postId } = req.body;

      if (threadId) {
        const thread = await Thread.findById(threadId);
        console.log(req.session.username);
        if (!thread) {
          res.status(400);
          res.json({ error: [errors.threadError] });
        } else {
          const attributes = thread.getAttributes(thread);

          const like = await Like.findAndCountAll({
            where: { ThreadId: attributes.id }
          });

          let error = false;
          like.rows.map(l => {
            if (l.UserId === req.session.userId) {
              console.log(l.UserId, attributes.UserId);
              error = true;
            }
          });

          if (!error) {
            await Like.create({
              UserId: req.session.userId,
              ThreadId: attributes.id
            });

            res.json({ success: true, count: like.count + 1 });
          } else {
            res.status(400);
            res.json({ error: [errors.invalidLike] });
          }
        }
      }

      if (postId) {
        const post = await Post.findById(postId);

        if (!post) {
          res.status(400);
          res.json({ error: [errors.postError] });
        } else {
          const attributes = post.getAttributes(post);

          const like = await Like.findAndCountAll({
            where: { postId: attributes.id }
          });

          let error = false;
          like.rows.map(l => {
            if (l.UserId === attributes.UserId) {
              error = true;
            }
          });

          if (!error) {
            await Like.create({
              UserId: req.session.userId,
              PostId: attributes.id
            });

            res.json({ success: true, count: like.count + 1 });
          } else {
            res.status(400);
            res.json({ error: [errors.invalidLike] });
          }
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

exports.removeLike = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
      const { threadId, postId } = req.body;

      if (threadId) {
        const like = await Like.findAll({
          where: { ThreadId: threadId, UserId: req.session.userId }
        });

        if (like.length <= 0) {
          res.status(400);
          res.json({ error: [errors.likeError] });
        } else {
          await Like.destroy({
            where: { ThreadId: threadId, UserId: req.session.userId }
          });

          const count = await Like.count({ where: { ThreadId: threadId } });

          res.json({ success: true, count });
        }
      }

      if (postId) {
        const like = await Like.findAll({
          where: { PostId: postId, UserId: req.session.userId }
        });

        if (like.length <= 0) {
          res.status(400);
          res.json({ error: [errors.likeError] });
        } else {
          await Like.destroy({
            where: { PostId: postId, UserId: req.session.userId }
          });

          const count = await Like.count({ where: { PostId: postId } });

          res.json({ success: true, count });
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
