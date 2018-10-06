"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "settings",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        forumName: {
          type: Sequelize.STRING
        },
        forumDescription: {
          type: Sequelize.TEXT
        },
        clanTag: {
          type: Sequelize.STRING
        },
        clanSize: {
          type: Sequelize.INTEGER
        },
        BlacklistId: {
          type: Sequelize.INTEGER
        },
        initialSetup: {
          type: Sequelize.BOOLEAN
        },
        clanShield: {
          type: Sequelize.STRING
        },
        showDescription: {
          type: Sequelize.BOOLEAN
        },
        showClanSize: {
          type: Sequelize.BOOLEAN
        },
        showBlacklist: {
          type: Sequelize.BOOLEAN
        },
        showClanShield: {
          type: Sequelize.BOOLEAN
        },
        maintenance: {
          type: Sequelize.BOOLEAN
        },
        lockForum: {
          type: Sequelize.BOOLEAN
        },
        allowBestPosts: {
          type: Sequelize.BOOLEAN
        },
        emailSubscriptionparticipants: {
          type: Sequelize.BOOLEAN
        },
        repostingDuration: {
          type: Sequelize.INTEGER
        },
        allowLikes: {
          type: Sequelize.BOOLEAN
        },
        editor: {
          type: Sequelize.ENUM,
          values: ["Plain Editor", "Markdown Editor"]
        },
        setAdminUser: {
          type: Sequelize.INTEGER
        },
        numberOfAdmins: {
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
    return queryInterface.dropTable("settings");
  }
};
