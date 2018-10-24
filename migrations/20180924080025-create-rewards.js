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
        init: { type: Sequelize.BOOLEAN, defaultValue: false },
        pointsPerPost: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerThread: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerLike: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerBestPost: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsForAdvertising: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerPollQuestion: { type: Sequelize.INTEGER, defaultValue: 0 },
        pointsPerPollVote: { type: Sequelize.INTEGER, defaultValue: 0 },
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
