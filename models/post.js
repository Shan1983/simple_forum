"use strict";
const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      discussion: {
        type: DataTypes.TEXT,
        set(val) {
          if (!val) {
            throw new sequelize.ValidationError(sequelize, {
              error: "discussion must be a string",
              field: "discussion"
            });
          }
          this.setDataValue("discussion", marked(val)); // set up with editor options later
        },
        allowNull: false
      },
      postPosition: { type: DataTypes.INTEGER },
      removed: { type: DataTypes.BOOLEAN, defaultValue: false },
      UserId: { type: DataTypes.INTEGER },
      ThreadId: { type: DataTypes.INTEGER },
      bestPost: { type: DataTypes.BOOLEAN, defaultValue: false },
      replyToUser: { type: DataTypes.STRING },
      ReplyId: { type: DataTypes.INTEGER },
      deletedAt: { type: DataTypes.DATE }
    },
    { paranoid: true }
  );

  // class methods

  Post.associate = function(models) {
    Post.belongsTo(models.User);
    Post.belongsTo(models.Thread);
    Post.hasMany(models.Post, { as: "Replies", foreignKey: "ReplyId" });
    Post.hasMany(models.Like, { foreignKeyConstraint: true });
    Post.hasMany(models.Report, {
      foreignKeyConstraint: true,
      onDelete: "CASCADE",
      hooks: true
    });
  };

  // return data from required models
  Post.postOptions = function() {
    const { User, Like, Thread, Post, Category, Village } = sequelize.models;

    return [
      { model: User, attributes: ["username", "id", "color", "avatar"] },
      {
        model: Like,
        where: { PostId: Post.id },
        attributes: ["username", "color", "avatar", "id"]
      },
      { model: Thread, include: [Category] },
      {
        model: Post,
        as: "Replies",
        include: [
          {
            model: User,
            attributes: ["id", "username", "color", "avatar"]
          }
        ]
      },
      Village
    ];
  };

  Post.prototype.getPostReplies = async function(id, thread) {
    const { Thread, User } = sequelize.models;

    const postReplies = await Post.findById(id, {
      include: [Thread, { model: User, attributes: ["username"] }]
    });

    if (!postReplies) {
      throw errors.parameterError("replyingToUser", "The post does not exist.");
    } else if (postReplies.Thread.id !== thread.id) {
      throw errors.parameterError(
        "replyingToUser",
        "You cannot reply cross site. i.e. you must be in the same thread."
      );
    } else if (postReplies.removed) {
      throw errors.postRemoved;
    } else {
      return postReplies;
    }
  };

  // instance methods

  Post.prototype.getReplyToUser = function() {
    return Post.findByPrimary(this.replyId);
  };

  Post.prototype.setReplyToUser = function() {
    return post.getUser().then(user => {
      return this.update({
        replyToUser: user.username,
        ReplyId: post.id
      });
    });
  };

  return Post;
};
