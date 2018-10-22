"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "reports",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        ThreadId: {
          type: Sequelize.INTEGER
        },
        PostId: {
          type: Sequelize.INTEGER
        },
        reason: {
          type: Sequelize.ENUM,
          values: [
            "Spam",
            "Inappropriate",
            "Harrassment",
            "Poster Requested",
            "Duplicate"
          ]
        },
        complaint: {
          type: Sequelize.TEXT
        },
        submittedBy: {
          type: Sequelize.STRING
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
    return queryInterface.dropTable("reports");
  }
};
