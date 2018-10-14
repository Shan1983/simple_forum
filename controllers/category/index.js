const {
  User,
  Post,
  Thread,
  Category,
  Sequelize,
  Log
} = require("../../models");
const errors = require("../../helpers/mainErrors");
const attributes = require("../../helpers/getModelAttributes");

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
      include: [
        {
          model: Thread,
          attributes: ["id", "titleBGColor", "title", "slug"],
          include: [{ model: User, attributes: ["username", "colorIcon"] }]
        }
      ]
    });

    if (!category) {
      res.status(400);
      res.json({ error: [errors.categoryError] });
    } else {
      const catReq = attributes.convert(category);

      const customThread = catReq.Threads.map(e => {
        return {
          title: e.title,
          icon: e.titleBGColor,
          user: e.User.username,
          path: `api/v1/thread/${e.id}`
        };
      });

      res.json({
        title: catReq.title,
        description: catReq.description,
        colorIcon: catReq.colorIcon,
        createdAt: catReq.createdAt,
        Threads: customThread
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.newCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const allCategories = await Category.findAll();

    let categoryError = false;

    allCategories.map(e => {
      if (e.title === slug(title)) {
        categoryError = true;
      }
    });

    if (categoryError) {
      res.status(400);
      res.json({ error: [errors.categoryTitleError] });
    } else {
      await Category.create({
        title: title,
        description
      });

      res.json({
        success: true
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(400);
      res.json({ error: [errors.categoryError] });
    } else {
      const { title, description } = req.body;

      await category.update({
        title: title,
        description
      });

      res.json({ success: true, category: category.toJSON() });
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(400);
      res.json({ error: [errors.categoryError] });
    } else {
      // so that threads aren't left without a category
      // let's create a new one and assign the thread to it..

      const OtherCategory = await Category.findOrCreate({
        where: { title: "Other" },
        defaults: { colorIcon: "#303030" }
      });

      // re assign effected threads
      await Thread.update(
        { CategoryId: OtherCategory[0].id },
        {
          where: { CategoryId: req.params.id }
        }
      );

      await category.destroy();

      res.json({
        success: true,
        createdOther: OtherCategory[1] ? OtherCategory[0] : null
      });
    }
  } catch (error) {
    next(error);
  }
};
