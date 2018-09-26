"use strict";
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

  // check if user can do mod stuff

  // check if user can do system system stuff

  // create special role for recruitment

  return Role;
};
