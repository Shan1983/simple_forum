const multer = require("multer");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const color = require("color");
const uuidv5 = require("uuid/v5");
const session = require("../controllers/userSession/userSession");
const {
  User,
  Post,
  Thread,
  Category,
  Sequelize,
  IpAddress,
  UserRole,
  Role,
  Log,
  Ban,
  Village,
  Troop,
  Spell,
  Hero
} = require("../models/index");
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
      where: { username: req.params.username },
      include: [{ model: Role, attributes: ["role"] }]
    };

    // if the params contains 'posts'
    if (req.params.posts || req.params.threads) {
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

      const includedThreads = {
        model: Thread,
        include: Thread.threadOptions(),
        limit,
        order: [["id", "DESC"]]
      };

      // check if id is <= from
      if (from !== null) {
        includedThreads.where = { id: { $lte: from } };
      }

      queryObj.include = [includedThreads];

      // get the users meta data
      const meta = await user.getUsersMetaData(limit);

      res.json(Object.assign(user.toJSON(limit), { meta }));
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

exports.userProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      include: [Role, Village, Troop, Spell, Hero]
    });

    if (!user) {
      res.status(400);
      res.json({ error: [errors.userNotExist] });
    }

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      res.status(400);
      res.json({ error: [errors.loginError] });
    } else {
      /**
       * Check if the user is banned
       */
      await Ban.checkIfBanned(user);

      /**
       * Check the users password check out
       */
      if (await user.validPassword(password)) {
        // create a new token
        if (user.accountVerified(user)) {
          const token = await jwtHelper.generateNewToken(user);

          /**
           * Set the users ipaddress
           */
          await IpAddress.createIpIfEmpty(req.ip, user);

          /**
           * Set the user internal session data
           */

          const roleMeta = await user.getRoles();
          const role = roleMeta[0].role;

          session.setupUserSession(
            req,
            res,
            user.username,
            user.id,
            role,
            token
          );

          res.json({ success: true, username: user.username, role, token });
        } else {
          res.status(400);
          res.json({ error: [errors.verifyAccountError] });
        }
      } else {
        res.status(401);
        res.json({ error: [errors.loginError] });
      }
    }
  } catch (error) {
    next(error);
  }
};
exports.register = async (req, res, next) => {
  const bcrypt = require("bcryptjs");
  try {
    /**
     * Check if user does not exist
     */
    const checkUser = await User.findOne({ where: { email: req.body.email } });

    if (checkUser) {
      res.status(400);
      res.json({ error: [errors.accountExists] });
    } else {
      const bcrypt = require("bcryptjs");

      const params = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        emailVerificationToken: uuidv5(req.body.email, uuidv5.DNS),
        emailVerified: false
      };

      /**
       * Create the user
       */
      const user = await User.create(params);

      /**
       * Set the users ipaddress
       */
      await IpAddress.createIpIfEmpty(req.ip, user);

      /**
       * assign user a role - all users start off as members
       */

      await UserRole.assignUserRole(user);

      res.json({ message: "Ok", path: `api/v1/user/login` });
    }
  } catch (error) {
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
