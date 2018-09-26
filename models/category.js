"use strict";
const randomColor = require("randomcolor");
const slug = require("slugify");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Category must have a name."
          },
          isString(val) {
            if (typeof val !== "string") {
              throw new sequelize.ValidationError(
                "The category must be a string"
              );
            }
          }
        }
      },
      description: {
        type: DataTypes.TEXT
      },
      colorIcon: {
        type: DataTypes.STRING,
        defaultValue() {
          return randomColor();
        }
      }
    },
    {}
  );

  // class methods

  Category.associate = function(models) {
    Category.hasMany(models.Threads);
  };

  Category.hook("beforeCreate", category => {
    if (!category.title) {
      throw new sequelize.ValidationError("The category must have a title");
    } else {
      // slugify the category title
      const title = slug(category.title).toUpperCase();
      category.title = title;
    }
  });
  return Category;
};
