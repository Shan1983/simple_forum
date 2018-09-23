"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.TEXT
        },
        colorIcon: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING,
          unique: true
        },
        RoleId: {
          type: Sequelize.INTEGER
        },
        VillageId: {
          type: Sequelize.INTEGER
        },
        points: {
          type: Sequelize.INTEGER,
          defautValue: 0
        },
        facebookToken: {
          type: Sequelize.STRING
        },
        googleToken: {
          type: Sequelize.STRING
        },
        FriendId: {
          type: Sequelize.INTEGER
        },
        avatar: {
          type: Sequelize.STRING
        },
        IpId: {
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
    return queryInterface.dropTable("users");
  }
};
