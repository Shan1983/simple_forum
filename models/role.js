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
    Role.belongsTo(models.User)
    Role.belongsToMany(models.User, { throught: "userrole" });
  };

  // instance methods

  // check if user can do admin stuff
  Role.prototype.isAdmin = async function(id) {
    const { Role } = sequelize.models;

    const userRole = await Role.findOne({
      where: { UserId: id }
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
  Role.prototype.isModerator = async function (id) {
    const { Role } = sequelize.models;

    const userRole = await Role.findOne({
      where: { UserId: id }
    });

    //loop?

    // check if admin
    if (!userRole.role === "Moderator") {
      throw errors.notAuthorized;
    } else {
      return true;
    }
  };

  // check if user can do system system stuff
  Role.prototype.isAdmin = async function (id) {
    const { Role } = sequelize.models;

    const userRole = await Role.findOne({
      where: { UserId: id }
    });

    //loop?

    // check if admin
    if (!userRole.role === "System") {
      throw errors.notAuthorized;
    } else {
      return true;
    }
  };

  // promote a new admin user
  Role.prototype.promoteToAdmin = function(id) {
    const {Role, User} = sequelize.models

    const user = await User.findById(id)

    if(!user) {
      throw errors.sequelizeValidation(sequelize, {
        errors: 'User does not exist.',
        userId: id
      })
    }

    // check users current role
    if(user.Role.role === 'Administrator') {
      throw errors.parameterError('role','This user is already an administrator.')
    } else if (user.Role.role === 'System') {
      throw errors.parameterError('role','This user cannot be changed.')
    }

    // promote the user to admin
    await Role.setUserRole(user)
    await Role.setRole('Administrator')

    const roleReload = Role.reload({
      include:[
        {model: Role, attributes: ['role']},
        {model: User, attributes: ['id','username','color','avatar']}
      ]
    })

    return roleReload;

  }

  // promote a new moderator
  Role.prototype.promoteToModerator = function(id) {
    const { Role, User } = sequelize.models

    const user = await User.findById(id)

    if (!user) {
      throw errors.sequelizeValidation(sequelize, {
        errors: 'User does not exist.',
        userId: id
      })
    }

    // check users current role
    if (user.Role.role === 'Moderator') {
      throw errors.parameterError('role', 'This user is already an moderator.')
    } else if (user.Role.role === 'System') {
      throw errors.parameterError('role', 'This user cannot be changed.')
    }

    // promote the user to admin
    await Role.setUserRole(user)
    await Role.setRole('Moderator')

    const roleReload = Role.reload({
      include: [
        { model: Role, attributes: ['role'] },
        { model: User, attributes: ['id', 'username', 'color', 'avatar'] }
      ]
    })

    return roleReload;
  }

  // create the system user
  Role.prototype.createSystem = function (id) {
    const { Role, User } = sequelize.models

    const user = await User.findById(id)

    if (!user) {
      throw errors.sequelizeValidation(sequelize, {
        errors: 'User does not exist.',
        userId: id
      })
    }

    // promote the user to admin
    await Role.setUserRole(user)
    await Role.setRole('System')

    const roleReload = Role.reload({
      include: [
        { model: Role, attributes: ['role'] },
        { model: User, attributes: ['id', 'username', 'color', 'avatar'] }
      ]
    })

    return roleReload;
  }


  return Role;
};
