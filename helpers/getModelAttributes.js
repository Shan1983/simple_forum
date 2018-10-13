const Sequelize = require("sequelize");
const { Role, UserRole } = require("../models");
/**
 * Return the attributes for a given model in JSON format
 */

exports.convert = model => {
  if (model instanceof Sequelize.Model) {
    return model.toJSON();
  } else {
    return false;
  }
};

exports.getUserRole = async user => {
  const convertedUser = this.convert(user);

  const roleRecord = await UserRole.findById(convertedUser.id);

  const roleResult = await Role.findById(roleRecord.RoleId);

  const userRole = this.convert(roleResult);

  const role = userRole.role;

  return role;
};
