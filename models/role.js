"use strict";

const errors = require("../helpers/mainErrors");

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      role: {
        type: DataTypes.STRING
      }
    },
    {}
  );

  // class Methods

  Role.associate = function(models) {
    // Role.belongsTo(models.User);
    // Role.belongsToMany(models.User, { through: "userrole" });
    Role.belongsToMany(models.User, { through: "userroles" });
  };

  // instance methods

  // promote a new admin user
  Role.prototype.promoteToAdmin = async function(id) {
    const { Role, User } = sequelize.models;

    const user = await User.findById(id);

    if (!user) {
      throw errors.sequelizeValidation(sequelize, {
        errors: "User does not exist.",
        userId: id
      });
    }

    // check users current role
    if (user.Role.role === "Administrator") {
      throw errors.parameterError(
        "role",
        "This user is already an administrator."
      );
    } else if (user.Role.role === "System") {
      throw errors.parameterError("role", "This user cannot be changed.");
    }

    // promote the user to admin
    await Role.setUserRole(user);
    await Role.setRole("Administrator");

    const roleReload = Role.reload({
      include: [
        { model: Role, attributes: ["role"] },
        { model: User, attributes: ["id", "username", "color", "avatar"] }
      ]
    });

    return roleReload;
  };

  // promote a new moderator
  Role.prototype.promoteToModerator = async function(id) {
    const { Role, User } = sequelize.models;

    const user = await User.findById(id);

    if (!user) {
      throw errors.sequelizeValidation(sequelize, {
        errors: "User does not exist.",
        userId: id
      });
    }

    // check users current role
    if (user.Role.role === "Moderator") {
      throw errors.parameterError("role", "This user is already an moderator.");
    } else if (user.Role.role === "System") {
      throw errors.parameterError("role", "This user cannot be changed.");
    }

    // promote the user to admin
    await Role.setUserRole(user);
    await Role.setRole("Moderator");

    const roleReload = Role.reload({
      include: [
        { model: Role, attributes: ["role"] },
        { model: User, attributes: ["id", "username", "color", "avatar"] }
      ]
    });

    return roleReload;
  };

  // create the system user
  Role.prototype.createSystem = async function(id) {
    const { Role, User } = sequelize.models;

    const user = await User.findById(id);

    if (!user) {
      throw errors.sequelizeValidation(sequelize, {
        errors: "User does not exist.",
        userId: id
      });
    }

    // promote the user to admin
    await Role.setUserRole(user);
    await Role.setRole("System");

    const roleReload = Role.reload({
      include: [
        { model: Role, attributes: ["role"] },
        { model: User, attributes: ["id", "username", "color", "avatar"] }
      ]
    });

    return roleReload;
  };

  return Role;
};
