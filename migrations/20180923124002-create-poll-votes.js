"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "pollVotes",
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
        PollQuestionId: {
          type: Sequelize.INTEGER
        },
        PollResponseId: {
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
    return queryInterface.dropTable("pollVotes");
  }
};
