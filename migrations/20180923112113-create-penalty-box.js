"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "penaltyBoxes",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        UserId: {
          type: Sequelize.INTEGER
        },
        duration: {
          type: Sequelize.INTEGER
        },
        reason: {
          type: Sequelize.TEXT
        },
        userCanCreatePost: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        userCanCreateThread: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        severity: {
          type: Sequelize.ENUM,
          values: ["Low", "High"]
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        charset: "utf8mb4"
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("penaltyBoxes");
  }
};
