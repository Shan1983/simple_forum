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
          notEmpty: { msg: "The title cannot be empty." },
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
      lockedReason: {
        type: DataTypes.ENUM,
        values: [
          "Spam",
          "Inappropriate",
          "Harrassment",
          "Poster Requested",
          "Duplicate"
        ]
      },
      lockedMessage: { type: DataTypes.STRING },
      CategoryId: { type: DataTypes.INTEGER },
      UserId: { type: DataTypes.INTEGER },
      PollQueryId: { type: DataTypes.INTEGER },
      isSticky: { type: DataTypes.BOOLEAN, defaultValue: false },
      stickyDuration: { type: DataTypes.DATE },
      SubscriptionId: { type: DataTypes.INTEGER },
      LikeId: { type: DataTypes.INTEGER },
      titleBGColor: {
        type: DataTypes.STRING,
        defaultValue() {
          return randomColor();
        }
      },
      discussion: {
        type: DataTypes.TEXT,
        set(val) {
          if (typeof val !== "string") {
            throw new sequelize.ValidationError("Email must be a string");
          }

          this.setDataValue("discussion", marked(val)); // set up with editor options later
        },
        allowNull: false
      },
      deletedAt: { type: DataTypes.DATE }
    },
    { paranoid: true }
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

  Thread.prototype.getAttributes = function(thread) {
    return thread.toJSON();
  };

  Thread.prototype.lockThread = async function(
    thread,
    lockedReason,
    lockedMessage
  ) {
    await thread.update({ locked: true, lockedReason, lockedMessage });
  };

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

  Thread.prototype.markAsSticky = async function(thread, duration) {
    // duration is an number of days
    const time = moment(new Date(), "YYYY-MM-DD HH:mm:ss").add(
      duration,
      "days"
    );

    thread.update({
      isSticky: true,
      stickyDuration: time
    });
    thread.reload();
  };

  Thread.prototype.removeSticky = async function(thread) {
    thread.update({
      isSticky: false,
      stickyDuration: null
    });
    thread.reload();
  };

  Thread.prototype.moveThread = async function(attr, category) {
    const StrippedString = attr.discussion.replace(/(<([^>]+)>)/gi, "");

    await Thread.create({
      title: attr.title,
      slug: slug(attr.slug),
      CategoryId: category.id,
      UserId: attr.UserId,
      discussion: StrippedString
    });
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
