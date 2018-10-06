"use strict";

module.exports = {
  // add the userrole
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "userroles",
      [
        {
          UserId: 2,
          RoleId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("userroles", null, {});
  }
};
