"use strict";
const marked = require("marked");
const Sequelize = require("sequelize");
const errors = require("../helpers/mainErrors");

// initialize basic marked options
marked.setOptions({
  highligh(hl) {
    return require("highlight.js").highlightAuto(hl).value;
  },
  sanitize: true
});

// module.exports = (sequelize, DataTypes) => {
//   const post = sequelize.define(
//     "post",
//     {
//       discussion: DataTypes.TEXT,
//       postPosition: DataTypes.INTEGER,
//       removed: DataTypes.BOOLEAN,
//       UserId: DataTypes.INTEGER,
//       ThreadId: DataTypes.INTEGER,
//       bestPost: DataTypes.INTEGER
//     },
//     {}
//   );
//   post.associate = function(models) {
//     // associations can be defined here
//   };
//   return post;
// };

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
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
        postPosition: {
          type: DataTypes.INTEGER
        },
        removed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        UserId: {
          type: DataTypes.INTEGER
        },
        ThreadId: {
          type: DataTypes.INTEGER
        },
        bestPost: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        }
      },
      {
        sequelize
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User);
    this.belongsTo(models.Thread);
    this.hasMany(models.Post, { as: "Replies", foreignKey: "ReplyId" });
    this.belongsTo(models.Like);
    this.hasMany(models.Report, {
      foreignKeyConstraint: true,
      onDelete: "CASCADE",
      hooks: true
    });
  }
};
