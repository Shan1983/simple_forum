"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "threads",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: { type: Sequelize.STRING, allowNull: false },
        slug: { type: Sequelize.STRING },
        postCount: { type: Sequelize.INTEGER, defaultValue: 0 },
        locked: { type: Sequelize.BOOLEAN, defaultValue: false },
        CategoryId: { type: Sequelize.INTEGER },
        UserId: { type: Sequelize.INTEGER },
        PollQueryId: { type: Sequelize.INTEGER },
        titleBGColor: { type: Sequelize.STRING },
        discussion: { type: Sequelize.TEXT, allowNull: false },
        lockedReason: {
          type: Sequelize.ENUM,
          values: [
            "Spam",
            "Inappropriate",
            "Harrassment",
            "Poster Requested",
            "Duplicate"
          ]
        },
        lockedMessage: { type: Sequelize.STRING },
        isSticky: { type: Sequelize.BOOLEAN, defaultValue: false },
        stickyDuration: { type: Sequelize.DATE },
        SubscriptionId: { type: Sequelize.INTEGER },
        LikeId: { type: Sequelize.INTEGER },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
        deletedAt: { type: Sequelize.DATE }
      },
      { charset: "utf8mb4" }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("threads");
  }
};
