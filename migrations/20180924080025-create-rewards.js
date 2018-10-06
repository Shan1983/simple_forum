"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "rewards",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        pointsPerPost: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerThread: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerLike: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerBestPost: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsForAdvertising: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerPollQuery: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerPollBallot: { type: Sequelize.INTEGER, defaultValue: 0 },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      },
      { charset: "utf8mb4" }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("rewards");
  }
};
