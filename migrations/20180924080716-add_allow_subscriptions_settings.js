"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("settings", "allowSubscriptions", {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn("settings", "allowSubscriptions");
  }
};
