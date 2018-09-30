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
      // RoleId: { type: DataTypes.INTEGER },
      // VillageId: { type: DataTypes.INTEGER },
      // PlayerId: { type: DataTypes.INTEGER },
      points: {
        type: DataTypes.INTEGER,
        validation: {
          isInt: true
        }
      },
      facebookToken: {
        type: DataTypes.STRING,
        validate: {
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError(
                "Facebook token must be a string."
              );
            }
          }
        }
      },
      googleToken: {
        type: DataTypes.STRING,
        validate: {
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError(
                "Google token must be a string."
              );
            }
          }
        }
      },
      // FriendId: { type: DataTypes.INTEGER },
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
      // IpId: { type: DataTypes.INTEGER }
    },
    {}
  );

  User.associate = function(models) {
    User.hasMany(models.Post);
    User.hasMany(models.Thread);
    User.belongsToMany(models.IpAddress, { through: "UserIp" });
    User.hasOne(models.Village);
    User.belongsTo(models.Role, { through: "userrole" });
  };

  User.prototype.updatePassword = async function(sentPassword, newPassword) {
    // check to make sure the user isnt using the previous password
    if (sentPassword === newPassword) {
      throw errors.passwordsAreTheSame;
    }

    // authenticate the password before updating
    const checkPassword = await bcrypt.compare(sentPassword, this.password);

    // if everything checks out do the update
    if (checkPassword) {
      await this.update({ password: newPassword });
    } else {
      throw errors.notAuthenticated;
    }
  };

  // compare passwords for use with logging in etc
  User.prototype.validPassword = async function(sentPassword) {
    return await bcrypt.compare(sentPassword, this.password);
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

  return User;
};
