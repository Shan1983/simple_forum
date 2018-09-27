"use strict";

const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  constRole = sequelize.define(
    "Role",
    {
      role: {
        type: DataTypes.ENUM,
        values: ["System", "Administrator", "Moderator", "Member"]
      }
    },
    {}
  );

  // class Methods

  Role.associate = function(models) {
    Role.belongsToMany(models.User, { throught: "userrole" });
  };

  // instance methods

  // check if user can do admin stuff
  Role.prototype.isAdmin = async function() {
    const { User } = sequelize.models;

    const userRole = await Role.findOne({
      where: { UserId: User.id }
    });

    //loop?

    // check if admin
    if (!userRole.role === "Administrator") {
      throw errors.notAuthorized;
    } else {
      return true;
    }
  };

  // check if user can do mod stuff

  // check if user can do system system stuff

  // create special role for recruitment

  return Role;
};
