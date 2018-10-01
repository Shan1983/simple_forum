const multer = require("multer");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const session = require("../controllers/userSession/userSession");
const {
  User,
  Post,
  Thread,
  Category,
  Sequelize,
  IpAdress,
  Log,
  Ban
} = require("../models");
const pagination = require("../helpers/pagination");
const errors = require("../helpers/mainErrors");
const jwtHelper = require("../helpers/jwtHelper");

/*
sharp(profilePicture.file)
            .resize(400, 400)
            .max()
            .toBuffer((err, buff) => {
              profilePicture.file = buff;
              cb(err || null, options);
            });
*/

/**
 * Returns a list of all users, this route is only for
 * Administrators
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (jwtHelper.getUserRole(token) === req.session.admin) {
      const users = await User.findAll({
        attributes: { exclude: ["password"] }
      });

      if (!users) {
        throw errors.noUsers;
      }

      // send the users
      res.json({ users });
    } else {
      res.json({});
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Returns a user and any threads, posts a user has made,
 * otherwise it returns just the users model minus their password
 */
exports.getUserMeta = async (req, res, next) => {
  try {
    // the user attributes
    const queryObj = {
      attributes: { exclude: ["password"] },
      where: { username: req.params.username }
    };

    // if the params contains 'posts'
    if (req.params.posts) {
      // req.query => the complete query string
      const { from, limit } = pagination.getPaginationProps(req.query, true);

      const includedPosts = {
        model: Post,
        include: Post.postOptions(),
        limit,
        order: [["id", "DESC"]]
      };

      // check if id is <= from
      if (from !== null) {
        includedPosts.where = { id: { $lte: from } };
      }

      queryObj.include = [includedPosts];

      // get the user
      const user = await User.findOne(queryObj);

      if (!user) {
        throw errors.accountNotExists;
      }

      // get the users meta data
      const meta = await user.getUsersMetaData(limit);

      res.json(Object.assign(user.toJSON(limit), { meta }));
    } else if (req.query.threads) {
      let queryStr = "";

      Object.keys(req.query).forEach(query => {
        queryStr += `&${query}=${req.query[query]}`;
      });

      // send them to ALL category route
      res.redirect(
        `api/v1/category/ALL?username=${req.params.username}${queryStr}`
      );
    } else {
      // otherwise just dump what we have
      const user = await User.findOne(queryObj);

      if (!user) {
        errors.userNotExist;
      }

      res.json(user.toJSON());
    }
  } catch (error) {
    next(error);
  }
};
