"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      UserId: DataTypes.INTEGER,
      RoleId: DataTypes.INTEGER
    },
    {}
  );
  UserRole.associate = function(models) {
    UserRole.belongsTo(models.User, { through: "userroles" });
    UserRole.belongsTo(models.Role, { through: "userroles" });
  };

  UserRole.assignRole = async function(user) {
    await UserRole.create({
      UserId: user.id,
      RoleId: 1
    });
  };

  return UserRole;
};
