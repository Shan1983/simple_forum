"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "posts",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        discussion: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        UserId: {
          type: Sequelize.INTEGER
        },
        ThreadId: {
          type: Sequelize.INTEGER
        },
        bestPost: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        LikeId: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deletedAt: { type: Sequelize.DATE }
      },
      { charset: "utf8mb4" }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("posts");
  }
};
