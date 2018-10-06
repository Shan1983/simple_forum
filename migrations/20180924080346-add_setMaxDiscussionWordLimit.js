"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("settings", "setMaxDiscussionWordLimit", {
      type: Sequelize.INTEGER,
      defaultValue: 1024
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("settings", "setMaxDiscussionWordLimit");
  }
};
