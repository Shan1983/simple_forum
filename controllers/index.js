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
