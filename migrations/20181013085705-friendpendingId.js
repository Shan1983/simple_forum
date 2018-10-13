"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "FriendPendingId", {
      type: Sequelize.INTEGER
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "FriendPendingId");
  }
};
