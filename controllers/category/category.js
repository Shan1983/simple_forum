const {
  User,
  Post,
  Thread,
  Category,
  Sequelize,
  Log
} = require("../../models");
const errors = require("../../helpers/mainErrors");

exports.getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll();

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

      console.log(req.body.title, description);

      Category.create({ title, description });

      res.json({
        success: true,
        message: `Category: ${title}, has been created.`
      });
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
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};