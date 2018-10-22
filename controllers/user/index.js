const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const uuidv5 = require("uuid/v5");
const session = require("./userSession/userSession");
const {
  User,
  Post,
  Thread,
  Blacklist,
  IpAddress,
  UserRole,
  Role,
  Log,
  Ban,
  Village,
  Troop,
  Spell,
  Hero
} = require("../../models");
const pagination = require("../../helpers/pagination");
const errors = require("../../helpers/mainErrors");
const jwtHelper = require("../../helpers/jwtHelper");
const validate = require("../../helpers/validation");
const attributes = require("../../helpers/getModelAttributes");
const penatly = require("../../helpers/pentalybox");

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
    const users = await User.findAll({
      attributes: {
        exclude: [
          "password",
          "emailVerificationToken",
          "emailVerified",
          "description",
          "RoleId",
          "updatedAt"
        ]
      }
    });

    const userObj = users.map(async usr => {
      return {
        id: usr.id,
        avatar: usr.avatar,
        username: usr.username,
        email: usr.email,
        colorIcon: usr.colorIcon,
        role: await attributes.getUserRole(usr),
        deleted: usr.deletedAt
      };
    });

    Promise.all(userObj).then(complete => {
      res.json({ users: complete });
    });
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
      attributes: {
        exclude: [
          "password",
          "emailVerificationToken",
          "emailVerified",
          "RoleId",
          "updatedAt",
          "deletedAt"
        ]
      }
    });

    if (!user) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      res.json(attributes.convert(user));
    }
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
      const userAttributes = attributes.convert(user);

      /**
       * Check if the user is banned
       */
      await Ban.checkIfBanned(userAttributes);

      /**
       * Check the users password check out
       */
      if (await user.validPassword(password)) {
        // create a new token
        if (user.accountVerified(user)) {
          // get the role and token

          const token = await jwtHelper.generateNewToken(user);
          const role = await attributes.getUserRole(user);

          /**
           * Set the users ipaddress
           */
          await IpAddress.createIpIfEmpty(req.ip, userAttributes.id);

          /**
           * Set the user internal session data
           */

          session.setupUserSession(
            req,
            res,
            user.username,
            user.id,
            role,
            token
          );

          await penatly.isUserInPenaltyBox(user.id, req);

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
  try {
    /**
     * check if they supplied the required infor
     */
    const { username, email, password } = req.body;

    if (
      validate.isEmpty(username) &&
      validate.isEmpty(email) &&
      validate.isEmpty(password)
    ) {
      res.status(400);
      res.json({ error: [errors.invalidRegister] });
    } else {
      /**
       * Check if user does not exist
       */
      const checkUser = await User.findOne({ where: { email } });

      if (checkUser) {
        res.status(400);
        res.json({ error: [errors.accountExists] });
      } else {
        const params = {
          username: username,
          email: email,
          password: bcrypt.hashSync(password, 10),
          emailVerificationToken: uuidv5(email, uuidv5.DNS),
          emailVerified: false,
          RoleId: 1
        };

        /**
         * Create the user
         */
        const user = await User.create(params);

        const userReq = attributes.convert(user);

        await UserRole.assignRole(userReq);

        /**
         * Set the users ipaddress
         */
        await IpAddress.createIpIfEmpty(req.ip, userReq.id);

        res.json({ success: true, redirect: "/verify" });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // destroy any sessions that we have on the user
    req.session.destroy(() => {
      res.clearCookie("username");
      res.clearCookie("UIadmin");
      res.clearCookie("token");
      res.json({
        success: true,
        message: "You have been logged out."
      });
    });
  } catch (error) {
    next(error);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);

    const userReq = attributes.convert(user);

    if (req.params.username === userReq.username) {
      // update the users profile

      if (
        req.body.password !== undefined &&
        req.body.oldPassword !== undefined
      ) {
        await user.updatePassword(req.body.password, req.body.oldPassword);

        res.json({
          success: true,
          message: "Your password has been updated."
        });
      }

      if (req.body.email !== undefined) {
        if (validate.validateEmail(req.body.email)) {
          await user.update({
            email: req.body.email,
            emailVerificationToken: uuidv5(req.body.email, uuidv5.DNS),
            emailVerified: false
          });
          return res.json({
            success: true,
            message:
              "Your email has been updated. Please validate your new email address."
          });
        } else {
          res.status(400);
          res.json({ error: [errors.emailError] });
        }
      }
      if (
        req.body.password === undefined &&
        req.body.oldPassword === undefined &&
        req.body.email === undefined
      ) {
        await user.update({
          description: req.body.description,
          allowAdvertising: !!req.body.allowAdvertising,
          emailSubscriptions: !!req.body.emailSubscriptions
        });

        return res.json({
          success: true,
          message: "Your profile has been updated."
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
// upload a new avatar
exports.upload = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (req.session.username !== username) {
      res.status(401);
      res.json({ error: [errors.notAuthorized] });
    } else {
      const user = await User.findOne({
        where: { username: req.session.username }
      });

      const filename = req.file.originalname;

      const finalFileName = `${uuidv5(filename, uuidv5.DNS)}${filename}`;

      await user.update({
        avatar: `uploads/${finalFileName}`
      });

      res.json({ success: true, message: "Avatar uploaded." });
    }
  } catch (error) {
    next(error);
  }
};
exports.getAvatar = async (req, res, next) => {
  try {
    if (!req.params.username) {
      res.status(400);
      res.json({ error: [errors.accountNotExists] });
    } else {
      const user = await User.findOne({
        where: { username: req.params.username }
      });

      res.json(user.toJSON().avatar);
    }
  } catch (error) {
    next(error);
  }
};

// soft deletes a users account
exports.closeAccount = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (req.session.username === username) {
      const user = await User.findById(req.session.userId);

      // close their account
      await user.destroy();
      req.session.destroy(() => {
        res.clearCookie("username");
        res.clearCookie("UIadmin");
        res.clearCookie("token");
        res.json({
          success: true,
          message:
            "Oh No! Your leaving us. We hope that you come back and join us again soon."
        });
      });
    } else {
      res.status(401);
      res.json({ error: [errors.notAuthorized] });
    }
  } catch (error) {
    next(error);
  }
};
// perminatly deletes a users account
exports.deleteUser = async (req, res, next) => {
  try {
    // removing a user's account perminatly -
    // this will add the user to the blacklist

    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res.status(400);
      return res.json({ error: [errors.accountNotExists] });
    } else {
      const role = await attributes.getUserRole(user);
      if (role === "Admin") {
        res.status(400);
        res.json({ error: [errors.canNotDeleteAdmin] });
      } else {
        const { tag, name, reason } = req.body;

        await Blacklist.create({
          playerTag: tag,
          currentName: name,
          previousName: name,
          reason
        });

        await user.destroy({ force: true });

        req.session.destroy(() => {
          res.clearCookie("username");
          res.clearCookie("UIadmin");
          res.clearCookie("token");
          res.json({ success: true });
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      where: { emailVerificationToken: token }
    });

    if (user) {
      await user.update({
        emailVerified: 1
      });

      return res.json({ success: true });
    } else {
      res.status(401);
      res.json({
        error: errors.notAuthorized
      });
    }
  } catch (error) {
    next(error);
  }
};
