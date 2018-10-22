"use strict";
const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
    {
      ThreadId: {
        type: DataTypes.INTEGER
      },
      PostId: {
        type: DataTypes.INTEGER
      },
      reason: {
        type: DataTypes.ENUM,
        values: [
          "Spam",
          "Inappropriate",
          "Harrassment",
          "Poster Requested",
          "Duplicate"
        ],
        validate: {
          isIn: {
            args: [
              [
                "Spam",
                "Inappropriate",
                "Harrassment",
                "Poster Requested",
                "Duplicate"
              ]
            ],
            msg: "Please only use one of the predefined options."
          }
        }
      },
      complaint: {
        type: DataTypes.TEXT,
        validate: {
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError(
                "The complaint must be a string."
              );
            }
          }
        }
      },
      submittedBy: {
        type: DataTypes.STRING
      }
    },
    {}
  );

  // class methods

  Report.associate = function(models) {
    Report.belongsTo(models.Thread);
    Report.belongsTo(models.Post);
  };

  // instance methods

  // check if the post or thread exists
  Report.prototype.checkIfValid = async function(type, id) {
    const { Post, Thread } = sequelize.models;

    if (type === "thread") {
      const thread = await Thread.findOne({
        where: { id }
      });

      if (!thread) {
        throw errors.parameterError("id", "That thread does not exist.");
      }
    } else if (type === "post") {
      const post = await Post.findOne({
        where: { id }
      });

      if (!post) {
        throw errors.parameterError("id", "That post does not exist.");
      }
    } else {
      return true;
    }
  };

  // data should be an object
  Report.prototype.submitNewReport = async function(data) {
    return await Report.create({
      ThreadId: data.threadId,
      PostId: data.PostId,
      reason: data.reason,
      submittedBy: data.userId
    });
  };
  return Report;
};
