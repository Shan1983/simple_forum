const { Thread, Post, Like, User } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

exports.addThreadLike = async (req, res, next) => {
  try {
    const { threadId, postId } = req.body;

    if (threadId) {
      const thread = await Thread.findById(threadId);

      if (!thread) {
        next(errors.threadError);
      } else {
        const threadReq = attributes.convert(thread);

        if (threadReq.UserId !== req.session.userId) {
          const like = await Like.findAndCountAll({
            where: { ThreadId: threadReq.id }
          });

          let error = false;
          like.rows.map(l => {
            if (l.UserId === req.session.userId) {
              error = true;
            }
          });

          if (!error) {
            await Like.create({
              UserId: req.session.userId,
              ThreadId: threadReq.id
            });

            res.json({ success: true, count: like.count + 1 });
          } else {
            next(errors.invalidLike);
          }
        } else {
          next(errors.invalidLike);
        }
      }
    }

    if (postId) {
      const post = await Post.findById(postId);

      if (!post) {
        next(errors.postError);
      } else {
        const postReq = attributes.convert(post);

        if (postReq.UserId !== req.session.userId) {
          const like = await Like.findAndCountAll({
            where: { PostId: postReq.id }
          });

          let error = false;
          like.rows.map(l => {
            if (l.UserId === req.session.userId) {
              error = true;
            }
          });

          if (!error) {
            await Like.create({
              UserId: req.session.userId,
              PostId: postReq.id
            });

            res.json({ success: true, count: like.count + 1 });
          } else {
            next(errors.invalidLike);
          }
        } else {
          next(errors.invalidLike);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.removeLike = async (req, res, next) => {
  try {
    const { threadId, postId } = req.body;

    if (threadId) {
      const like = await Like.findAll({
        where: { ThreadId: threadId, UserId: req.session.userId }
      });

      if (like.length <= 0) {
        next(errors.likeError);
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
        next(errors.likeError);
      } else {
        await Like.destroy({
          where: { PostId: postId, UserId: req.session.userId }
        });

        const count = await Like.count({ where: { PostId: postId } });

        res.json({ success: true, count });
      }
    }
  } catch (error) {
    next(error);
  }
};
