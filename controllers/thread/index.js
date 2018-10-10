const { User, Category, Thread, Post, Village } = require("../../models");
const errors = require("../../helpers/mainErrors");
const slug = require("slugify");
const jwtHelper = require("../../helpers/jwtHelper");

// /:category/
exports.postNewThread = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
      if (req.session.userId) {
        const param = req.params.category;

        const category = await Category.findOne({
          where: { id: param }
        });

        if (!category) {
          res.status(400);
          res.json({ error: [errors.categoryError] });
        } else {
          const categoryAttributes = category.getAttributes(category);
          await Thread.create({
            title: req.body.title,
            slug: slug(req.body.slug),
            CategoryId: categoryAttributes.id,
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
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
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

// /:threadId/lock
exports.lockThread = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      if (!req.session.role || req.session.role !== "Member") {
        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
          res.status(400);
          res.json({ error: [errors.threadError] });
        } else {
          thread.lockThread(thread, req.body.reason, req.body.message);
          res.json({ success: true });
        }
      } else {
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
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

// /:threadId/make-sticky
exports.stickyThread = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      if (!req.session.role || req.session.role !== "Member") {
        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
          res.status(400);
          res.json({ error: [errors.threadError] });
        } else {
          const attr = thread.getAttributes(thread);
          if (attr.locked) {
            res.status(400);
            res.json({ error: [errors.lockedError] });
          } else {
            await thread.markAsSticky(thread, req.body.duration);
            res.json({ success: true });
          }
        }
      } else {
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
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

// /:threadId/move
exports.moveThread = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      if (!req.session.role || req.session.role !== "Member") {
        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
          res.status(400);
          res.json({ error: [errors.threadError] });
        } else {
          const newCategory = await Category.findById(req.body.category);

          if (!newCategory) {
            res.status(400);
            res.json({ error: [errors.categoryError] });
          } else {
            const category = newCategory.getAttributes(newCategory);
            const attr = thread.getAttributes(thread);

            // move the thread to the new category
            await thread.lockThread(
              thread,
              null,
              `Moved to: ${category.title}`
            );

            if (attr.isSticky) {
              await thread.removeSticky(thread);
            }

            await thread.moveThread(attr, category);

            res.json({ success: true });
          }
        }
      } else {
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
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

// /:threadId
exports.getThread = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
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
        res.status(400);
        res.json({ error: [errors.threadError] });
      } else {
        const attr = thread.getAttributes(thread);

        if (attr.locked) {
          res.status(400);
          res.json({ error: [errors.lockedError] });
        } else {
          // check sticky duration
          if (attr.isSticky) {
            if (attr.duration > new Date()) {
              thread.removeSticky(thread);
            }
          }

          res.json({
            title: attr.title,
            slug: attr.slug,
            postCount: attr.postCount,
            locked: attr.locked,
            lockedReason: attr.lockedReason,
            lockedMessage: attr.lockedMessage,
            isSticky: attr.isSticky,
            stickyDuration: attr.stickyDuration,
            titleBGColor: attr.titleBGColor,
            discussion: attr.discussion,
            createdAt: attr.createdAt,
            Category: attr.Category.title,
            Posts: attr.Posts
          });
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

// /:categoryId/deleted/threads
exports.getDeletedThreads = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      if (req.session.role !== "Member") {
        const category = await Category.findOne({
          where: { id: req.params.categoryId },
          include: [{ model: Thread, paranoid: false }]
        });

        if (!category) {
          res.status(400);
          res.json({ error: [errors.categoryError] });
        } else {
          const deletedItems = category.getAttributes(category);

          const deleted = deletedItems.Threads.map(e => {
            if (e.deletedAt) {
              return {
                category: deletedItems.title,
                title: e.title,
                slug: e.slug,
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
      } else {
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
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

// /:threadId
// make sure only the creator can edit a thread!
exports.updateThread = async (req, res, next) => {
  const thread = await Thread.findById(req.params.threadId);
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      if (!thread) {
        res.status(400);
        res.json({ error: [errors.threadError] });
      } else {
        const threadAttr = thread.getAttributes(thread);
        if (req.session.userId === threadAttr.UserId) {
          const { title, discussion } = req.body;
          await thread.update({
            title: `Edited - ${title}`,
            slug: slug(title),
            discussion,
            updatedAt: new Date()
          });

          await thread.reload();

          const updatedThread = thread.getAttributes(thread);

          res.json({
            title: updatedThread.title,
            slug: updatedThread.slug,
            postCount: updatedThread.postCount,
            locked: updatedThread.locked,
            lockedReason: updatedThread.lockedReason,
            lockedMessage: updatedThread.lockedMessage,
            isSticky: updatedThread.isSticky,
            stickyDuration: updatedThread.stickyDuration,
            titleBGColor: updatedThread.titleBGColor,
            discussion: updatedThread.discussion,
            updatedAt: updatedThread.updatedAt
          });
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

// /:threadId
// make sure only a admin can do this!
exports.deleteThread = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);
    if (decodedToken.id === req.session.userId) {
      if (req.session.role !== "Admin") {
        res.status(401);
        res.json({ error: [errors.notAuthorized] });
      } else {
        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
          res.status(400);
          res.json({ error: [errors.threadError] });
        } else {
          await thread.destroy();
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
