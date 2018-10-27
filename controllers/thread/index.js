const { User, Category, Thread, Post, Village } = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");
const penalty = require("../../helpers/pentalybox");

// /:category/
exports.postNewThread = async (req, res, next) => {
  try {
    penalty.penaltyDuration(req);
    if (await penalty.penaltyCanCreateThread(req)) {
      const id = req.params.category;

      const category = await Category.findOne({
        where: { id }
      });

      if (!category) {
        // res.status(400);
        next(errors.categoryError);
        // res.json({ error: [errors.categoryError] });
      } else {
        await Thread.create({
          title: req.body.title,
          CategoryId: req.params.category,
          UserId: req.session.userId,
          discussion: req.body.discussion
        });

        const user = await User.findById(req.session.userId);

        await user.increment("postCount", { by: 1 });

        res.json({
          success: true
        });
      }
    } else {
      next(errors.penaltyError);
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId/lock
exports.lockThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);

    if (!thread) {
      next(errors.threadError);
    } else {
      thread.lockThread(thread, req.body.reason, req.body.message);
      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};

exports.lockReasons = async (req, res, next) => {
  try {
    const request = await Thread.findById(req.params.threadId);
    if (!request) {
      next(errors.threadError);
    } else {
      const lockReq = attributes.convert(request);
      res.json({ reasons: lockReq.lockedReason });
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId/make-sticky
exports.stickyThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      next(errors.threadError);
    } else {
      const threadReq = attributes.convert(thread);
      if (threadReq.locked) {
        next(errors.lockedError);
      } else {
        await thread.markAsSticky(thread, req.body.duration);
        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId/move
exports.moveThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      next(errors.threadError);
    } else {
      const newCategory = await Category.findById(req.body.category);

      if (!newCategory) {
        next(errors.categoryError);
      } else {
        const categoryReq = attributes.convert(newCategory);
        const threadReq = attributes.convert(thread);

        // move the thread to the new category
        await thread.lockThread(thread, null, `Moved to: ${categoryReq.title}`);

        if (threadReq.isSticky) {
          await thread.removeSticky(thread);
        }

        await thread.moveThread(threadReq, categoryReq);

        res.json({ success: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId
exports.getThread = async (req, res, next) => {
  try {
    const thread = await Thread.findOne({
      where: { id: req.params.threadId },
      include: [
        { model: Category, attributes: ["title"] },
        {
          model: Post,
          attributes: ["discussion", "bestPost", "createdAt"],
          include: [
            {
              model: User,
              attributes: ["username", "colorIcon", "points", "postCount"],
              includes: [
                {
                  model: Village,
                  attributes: ["townhallLevel", "playerTag", "clanRole"]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!thread) {
      next(errors.threadError);
    } else {
      const threadReq = attributes.convert(thread);

      if (threadReq.locked) {
        next(errors.lockedError);
      } else {
        // check sticky duration
        if (threadReq.isSticky) {
          if (threadReq.duration > new Date()) {
            thread.removeSticky(thread);
          }
        }

        res.json({
          title: threadReq.title,
          postCount: threadReq.postCount,
          locked: threadReq.locked,
          lockedReason: threadReq.lockedReason,
          lockedMessage: threadReq.lockedMessage,
          isSticky: threadReq.isSticky,
          stickyDuration: threadReq.stickyDuration,
          titleBGColor: threadReq.titleBGColor,
          discussion: threadReq.discussion,
          createdAt: threadReq.createdAt,
          Category: threadReq.Category.title,
          Posts: threadReq.Posts
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:categoryId/deleted/threads
exports.getDeletedThreads = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.categoryId },
      include: [{ model: Thread, paranoid: false }]
    });

    if (!category) {
      next(errors.categoryError);
    } else {
      const catReq = attributes.convert(category);

      const deleted = catReq.Threads.map(e => {
        if (e.deletedAt) {
          return {
            category: catReq.title,
            title: e.title,
            postCount: e.postCount,
            titleBGColor: e.titleBGColor,
            discussion: e.discussion,
            deletedAt: e.deletedAt,
            createdAt: e.createdAt
          };
        }
      });

      res.json({ deletedThreads: deleted });
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId
// make sure only the creator can edit a thread!
exports.updateThread = async (req, res, next) => {
  const thread = await Thread.findById(req.params.threadId);
  try {
    if (!thread) {
      next(errors.threadError);
    } else {
      const threadReq = attributes.convert(thread);
      if (req.session.userId === threadReq.UserId) {
        const { title, discussion } = req.body;
        // on front end use updatedAt to test if its been changed
        await thread.update({
          title: `Edited - ${title}`, // remove edit once tested
          discussion,
          updatedAt: new Date()
        });

        await thread.reload();

        const updateReq = attributes.convert(thread);

        res.json({
          title: updateReq.title,
          postCount: updateReq.postCount,
          locked: updateReq.locked,
          lockedReason: updateReq.lockedReason,
          lockedMessage: updateReq.lockedMessage,
          isSticky: updateReq.isSticky,
          stickyDuration: updateReq.stickyDuration,
          titleBGColor: updateReq.titleBGColor,
          discussion: updateReq.discussion,
          createdAt: updateReq.createdAt,
          updatedAt: updateReq.updatedAt
        });
      } else {
        next(errors.notAuthorized);
      }
    }
  } catch (error) {
    next(error);
  }
};

// /:threadId
// make sure only a admin can do this!
exports.deleteThread = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.threadId);

    if (!thread) {
      next(errors.threadError);
    } else {
      await thread.destroy();
      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};
