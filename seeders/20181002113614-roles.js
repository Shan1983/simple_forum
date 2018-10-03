"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("roles", [
      {
        role: "Member",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role: "Moderator",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role: "Administrator",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role: "System",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  }
};
