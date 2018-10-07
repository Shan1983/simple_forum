const {
  User,
  Post,
  Thread,
  Category,
  Sequelize,
  Log
} = require("../../models");
const errors = require("../../helpers/mainErrors");
const slug = require("slugify");

exports.getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll();

    if (!categories) {
      res.status(400);
      res.json({ error: [errors.categoryError] });
    }

    res.json(categories);
  } catch (error) {
    next(error);
  }
};
exports.getAllThreadsInCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      include: [Thread]
    });

    if (!category) {
      res.status(400);
      res.json({ error: [errors.categoryError] });
    } else {
      res.json(category.toJSON());
    }
  } catch (error) {
    next(error);
  }
};

exports.newCategory = async (req, res, next) => {
  try {
    if (req.session.role === "Admin") {
      const { title, description } = req.body;

      const allCategories = await Category.findAll();

      let categoryError = false;

      allCategories.map(e => {
        if (e.title === slug(title).toUpperCase()) {
          categoryError = true;
        }
      });

      if (categoryError) {
        res.status(400);
        res.json({ error: [errors.categoryTitleError] });
      } else {
        const newCategory = await Category.create({
          title: slug(title),
          description
        });

        res.json({
          success: true,
          message: `Category: ${slug(title).toUpperCase()}, has been created.`
        });
      }
    } else {
      res.status(401);
      res.json({ error: [errors.notAuthorized] });
    }
  } catch (error) {
    next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    if (req.session.role === "Admin") {
      const category = await Category.findById(req.params.id);

      if (!category) {
        res.status(400);
        res.json({ error: [errors.categoryError] });
      } else {
        const { title, description } = req.body;

        await category.update({
          title: slug(title).toUpperCase(),
          description
        });

        res.json({ success: true, category: category.toJSON() });
      }
    } else {
      res.status(401);
      res.json({ error: [errors.notAuthorized] });
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    if (req.session.role === "Admin") {
      const category = await Category.findById(req.params.id);

      if (!category) {
        res.status(400);
        res.json({ error: [errors.categoryError] });
      } else {
        await category.destroy();

        res.json({ success: true });
      }
    } else {
      res.status(401);
      res.json({ error: [errors.notAuthorized] });
    }
  } catch (error) {
    next(error);
  }
};
