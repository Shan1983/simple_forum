"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "issuetrackers",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        issue: { type: Sequelize.STRING },
        severity: {
          type: Sequelize.ENUM,
          values: ["LOW", "MODERATE", "HIGH", "URGENT"]
        },
        notes: { type: Sequelize.TEXT },

        UserId: { type: Sequelize.INTEGER },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      },
      { charset: "utf8mb4" }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("issuetrackers");
  }
};
