"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "logs",
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
        ThreadId: {
          type: Sequelize.INTEGER
        },
        SessionId: {
          type: Sequelize.INTEGER
        },
        resource: {
          type: Sequelize.STRING
        },
        method: {
          type: Sequelize.ENUM,
          values: ["GET", "POST", "PUT", "DELETE"]
        },
        status: {
          type: Sequelize.INTEGER
        },
        created: {
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
      {
        charset: "utf8mb4"
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("logs");
  }
};
