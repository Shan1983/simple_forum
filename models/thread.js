"use strict";
const slug = require("slugify");
const randomColor = require("randomcolor");
const moment = require("moment");
const errors = require("../helpers/mainErrors");
const marked = require("marked");

marked.setOptions({
  highlight: function() {
    return require("highlight.js").highlightAuto(val).value;
  },
  sanitize: true
});

module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define(
    "Thread",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          this.setDataValue("title", val);
          if (val) {
            this.setDataValue("slug", slug(val).toLowerCase());
          }
        },
        validate: {
          notEmpty: {
            msg: "The title cannot be empty."
          },
          len: {
            args: [3, 240],
            msg: "The title must be between 3 and 240 characters."
          },
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError(
                "The title must be a string."
              );
            }
          }
        }
      },
      slug: { type: DataTypes.STRING },
      postCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      locked: { type: DataTypes.BOOLEAN, defaultValue: false },
      CategoryId: { type: DataTypes.INTEGER },
      UserId: { type: DataTypes.INTEGER },
      PollQueryId: { type: DataTypes.INTEGER },
      isSticky: { type: DataTypes.BOOLEAN, defaultValue: false },
      stickyDuration: { type: DataTypes.DATE },
      threadPosition: { type: DataTypes.INTEGER },
      SubscriptionId: {
        type: DataTypes.INTEGER
      },
      LikeId: {
        type: DataTypes.INTEGER
      },
      titleBGColor: {
        type: DataTypes.STRING,
        defaultValue() {
          return randomColor();
        }
      },
      discussion: {
        type: DataTypes.TEXT,
        set(val) {
          this.setDataValue("discussion", marked(val)); // set up with editor options later
        },
        allowNull: false
      }
    },
    {}
  );

  // class methods

  Thread.associate = function(models) {
    Thread.belongsTo(models.User);
    Thread.belongsTo(models.Category);
    Thread.belongsTo(models.PollQuery);
    Thread.hasMany(models.Subscription, { foreignKeyConstraint: true });
    Thread.hasMany(models.Post, {
      foreignKeyConstraint: true,
      onDelete: "CASCADE"
    });
    Thread.hasMany(models.Like, { foreignKeyConstraint: true });
  };

  // get other related thread data to return
  Thread.threadOptions = function(from, limit) {
    const { User, Category, Post, Thread, Villlage } = sequelize.models;

    return [
      { model: User, attributes: ["id", "username", "color", "avatar"] },
      Category,
      {
        model: Post,
        where: { postPosition: { $gte: from } },
        order: [["id", "ASC"]],
        limit,
        include: [
          { model: Thread, attributes: ["slug"] },
          { model: Like, where: { ThreadId: Thread.id } },
          { model: User, attributes: ["id", "username", "color", "avatar"] },
          {
            model: Post,
            as: "Replies",
            include: [
              {
                User,
                attributes: ["id", "username", "color", "avatar"]
              }
            ]
          },
          Village
        ]
      }
    ];
  };

  // instance methods

  Thread.prototype.getMetaData = function(limit) {
    let meta = {};

    const posts = this.Post;
    const firstPost = posts[0];
    const lastPost = posts.slice(-1)[0];

    // get the next url for user threads
    if (!lastPost || lastPost.postPosition + 1 === this.postCount) {
      meta.nextURL = null;
    } else {
      meta.URL = trim(
        `api/v1/thread/${this.id}?limit=${limit}&from=${lastPost.postPosition +
          1}`
      );
    }

    // get the previous url
    if (!firstPost || firstPost.postPosition === 0) {
      meta.prevURL = trim(
        `/api/v1/thread/${this.id}?limit=${firstPost.postPosition}&from=0`
      );
    } else {
      meta.prevURL = trim(
        `/api/v1/thread/${
          this.id
        }?limit=${limit}&from=${firstPost.postPosition - limit}`
      );
    }

    // get the post counts
    if (lastPost === undefined) {
      meta.nextPostCount = 0;
      meta.prevPostCount = 0;
      meta.remainingPosts = 0;
    } else {
      const remaining = this.postPosition - lastPost.postPosition - 1;

      meta.remainingPosts = remaining;

      if (remaining < limit) {
        meta.nextPostCount = remaining;
      } else {
        meta.nextPostCount = limit;
      }

      if (firstPost.postPosition === 0) {
        meta.prevPostCount = 0;
      } else if (firstPost.postPosition - limit < 0) {
        meta.prevPostCount = firstPost.postPosition;
      } else {
        meta.prevPostCount = limit;
      }
    }
  };

  Thread.prototype.moveThisThreadTo = async function(id, newCategory) {
    const { Thread, Category } = sequelize.models;
    const currentCategory = await Category.findByPrimary(this.CategoryId);
    const allCategories = await Category.findAll();

    if (id === currentCategory.id) {
      throw errors.parameterError(
        "CategoryId",
        "You cannot move this thread to the same category."
      );
    } else if (!allCategories) {
      throw errors.categoryError;
    } else {
      Thread.update({
        CategoryId: id
      });
    }
  };

  Thread.prototype.markAsSticky = async function(id) {
    const thread = await Thread.findById(id);
    const currentThreadPosition = thread.threadPosition;

    if (!thread) {
      throw errors.parameterError("threadId", "That thread does not exist.");
    }

    thread.unshift(currentThreadPosition);

    thread.reload();
  };

  Thread.prototype.checkStickyDuration = async function() {
    const expires = await Thread.findOne({
      where: { duration: moment() }
    });

    if (moment().isAfter(expires.duration)) {
      this.update({
        isSticky: false
      });
    }
  };

  return Thread;
};
