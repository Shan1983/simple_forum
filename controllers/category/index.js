const {
  User,
  Post,
  Thread,
  Category,
  Sequelize,
  Log
} = require("../../models");
const errors = require("../../helpers/mainErrors");
const jwtHelper = require("../../helpers/jwtHelper");
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
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
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
        const catAttr = category.getAttributes(category);

        const customThread = catAttr.Threads.map(e => {
          return {
            title: e.title,
            icon: e.titleBGColor,
            user: e.User.username,
            path: `api/v1/thread/${e.id}`
          };
        });

        res.json({
          title: catAttr.title,
          description: catAttr.description,
          colorIcon: catAttr.colorIcon,
          createdAt: catAttr.createdAt,
          Threads: customThread
        });
      }
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.status(400);
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};

exports.newCategory = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
      if (req.session.role === "Admin") {
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
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.status(400);
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
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
    } else {
      // file a report on the user trying to do something out of the norm
      // grab their ip address
      // sign them out
      // destroy any sessions
      // send them to a warning page
      res.status(400);
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwtHelper.decodeJwt(token);

    if (decodedToken.id === req.session.userId) {
      if (req.session.role === "Admin") {
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
      res.status(400);
      res.redirect("/views/warning/activity");
    }
  } catch (error) {
    next(error);
  }
};
