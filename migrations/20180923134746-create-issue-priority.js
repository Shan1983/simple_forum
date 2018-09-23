"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "issuePriorities",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        response: {
          type: Sequelize.STRING
        },
        IssueId: {
          type: Sequelize.INTEGER
        },
        UserId: {
          type: Sequelize.INTEGER
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
      { charset: "utf8mb4" }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("issuePriorities");
  }
};
