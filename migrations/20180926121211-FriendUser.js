"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("frienduser", {
      UserId: Sequelize.INTEGER,
      FriendId: Sequelize.INTEGER
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("frienduser");
  }
};
