"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: { type: Sequelize.STRING },
        description: { type: Sequelize.TEXT },
        colorIcon: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING, unique: true },
        RoleId: { type: Sequelize.INTEGER },
        VillageId: { type: Sequelize.INTEGER },
        points: { type: Sequelize.INTEGER, defautValue: 0 },
        emailVerificationToken: {
          type: Sequelize.STRING
        },
        emailVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        FriendId: { type: Sequelize.INTEGER },
        avatar: { type: Sequelize.STRING },
        allowAdvertising: { type: Sequelize.BOOLEAN, defautValue: false },
        emailSubscriptions: { type: Sequelize.BOOLEAN, defaultValue: true },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
        deletedAt: { type: Sequelize.DATE }
      },
      { charset: "utf8mb4" }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
