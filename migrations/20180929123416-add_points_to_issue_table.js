"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("issuetrackers", "points", {
      type: Sequelize.INTEGER
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn("issuetrackers", "points");
  }
};
