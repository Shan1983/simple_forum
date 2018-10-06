"use strict";
module.exports = (sequelize, DataTypes) => {
  const Issuetracker = sequelize.define(
    "Issuetracker",
    {
      issue: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 500],
            msg: "Isee must be between 1 and 500 characters"
          },
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError("The issue must be a string.");
            }
          }
        }
      },
      severity: {
        type: DataTypes.ENUM,
        values: ["LOW", "MODERATE", "HIGH", "URGENT"]
      },
      notes: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [1, 500],
            msg: "Notes must be between 1 and 500 characters"
          },
          isString(val) {
            if (typeof val !== "string") {
              throw sequelize.ValidationError("Notes must be a string");
            }
          }
        }
      },
      UserId: { type: DataTypes.INTEGER },
      points: { type: DataTypes.INTEGER, defaultValue: 0 }
    },
    {}
  );

  // class Methods

  Issuetracker.associate = function(models) {
    Issuetracker.belongsTo(models.User);
  };

  // instance Methods
  Issuetracker.prototype.upVote = async function() {
    await this.points.increment("points", { by: 1 });
    return true;
  };

  return Issuetracker;
};
