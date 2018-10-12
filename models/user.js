"use strict";

const randomColor = require("randomcolor");
const bcrypt = require("bcryptjs");
const pagination = require("../helpers/pagination");
const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError("Username must be a string.");
            }
          },
          checkBlankChars(val) {
            if (/\s/g.test(val)) {
              throw new sequelize.ValidationError(
                "Username cannot contain blank characters."
              );
            }
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [1, 1024],
            msg: "Description must be between 1 and 1024 characters."
          },
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError("Username must be a string.");
            }
          }
        }
      },
      colorIcon: {
        type: DataTypes.STRING,
        defaultValue() {
          return randomColor();
        }
      },
      postCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 100],
            msg: "Password must be between 6 and 100 characters"
          },
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError("Username must be a string.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: { msg: "Email is already registered.", fields: ["email"] },
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
          len: {
            args: [1, 100],
            msg: "Email must be between 1 and 100 characters"
          },
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError("Email must be a string");
            }
          }
        }
      },
      allowAdvertising: { type: DataTypes.BOOLEAN, defautValue: false },
      emailSubscriptions: { type: DataTypes.BOOLEAN, defaultValue: true },
      RoleId: { type: DataTypes.INTEGER }, // VillageId: { type: DataTypes.INTEGER },
      // PlayerId: { type: DataTypes.INTEGER },
      points: { type: DataTypes.INTEGER, validation: { isInt: true } },
      emailVerificationToken: { type: DataTypes.STRING },
      emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false }, // FriendId: { type: DataTypes.INTEGER },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError("Avatar must be a string.");
            }
          }
        }
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ["id", "username", "email"]
        }
      ]
    }
  );

  User.associate = function(models) {
    User.hasMany(models.Post);
    User.hasMany(models.Thread);
    User.hasMany(models.Friend);
    User.hasMany(models.FriendPending);
    User.belongsToMany(models.IpAddress, { through: "userip" });
    User.hasOne(models.Village);
    User.belongsToMany(models.Role, { through: "userroles" });
    User.hasMany(models.Troop);
    User.hasMany(models.Spell);
    User.hasMany(models.Hero);
    // User.belongsToMany(models.UserRole, { through: "userroles" });
    // User.hasOne(models.Role);
  };

  User.prototype.updatePassword = async function(newPassword, oldPassword) {
    // check to make sure the user isnt using the previous password
    if (newPassword === oldPassword) {
      throw errors.passwordsAreTheSame;
    }

    // authenticate the password before updating
    const checkPassword = await bcrypt.compare(oldPassword, this.password);

    // if everything checks out do the update
    if (checkPassword) {
      const pendingNewPassword = bcrypt.hashSync(newPassword, 10);
      await this.update({ password: pendingNewPassword });
      return true;
    } else {
      throw errors.passwordError;
    }
  };

  // compare passwords for use with logging in etc
  User.prototype.validPassword = async function(newPassword) {
    return await bcrypt.compare(newPassword, this.password);
  };

  User.prototype.accountVerified = function(user) {
    if (user.emailVerified) {
      return true;
    }

    return false;
  };

  User.prototype.getUsersMetaData = async function(limit) {
    const Post = sequelize.Models.Post;
    let metaData = {};

    // get the id of the next post
    const nextPostId = await pagination.getNextIdOrderedByDesc(
      Post,
      { UserId: this.id },
      this.Post
    );

    // build the required url
    if (nextPostId === null) {
      metaData.URL = null;
      metaData.PostCount = 0;
    } else {
      metaData.URL = trim(
        `/api/v1/${this.username}?posts=true&limit=${limit}&from=${nextPostId -
          1}`
      );
      metaData.PostCount = await pagination.getTotalPostCount(
        Post,
        this.Post,
        limit,
        { UserId: this.id },
        true
      );
    }

    return metaData;
  };

  // return users posts
  User.userOptions = function(from, limit) {
    const { Post, Village } = sequelize.models;

    return [
      {
        model: models.Post,
        include: Post.postOptions,
        limit,
        where: { postNumber: { $gte: from } },
        order: [["id", "ASC"]]
      },
      Village
    ];
  };

  User.prototype.getAttributes = function(user) {
    return user.toJSON();
  };

  return User;
};
