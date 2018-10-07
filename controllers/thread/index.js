const { User, Category, Thread } = require("../../models");
const errors = require("../../helpers/mainErrors");
const slug = require("slugify");

// /:category/
exports.postNewThread = async (req, res, next) => {
  try {
    if (req.session.userId) {
      const param = req.params.category;

      const category = await Category.findOne({
        where: { title: param }
      });

      const categoryAttributes = category.getAttributes(category);

      console.log(req.body.discussion);

      if (!category) {
        res.status(400);
        res.json({ error: [errors.categoryError] });
      } else {
        const thread = await Thread.create({
          title: req.body.title,
          slug: slug(req.body.slug),
          CategoryId: categoryAttributes.id,
          UserId: req.session.userId,
          discussion: req.body.discussion
        });

        res.json(thread.toJSON());
      }
    }
  } catch (error) {
    next(error);
  }
};
