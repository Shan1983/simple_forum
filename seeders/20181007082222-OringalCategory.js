"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "categories",
      [
        {
          title: "TEST",
          description: "Seeded test category",
          colorIcon: "#26af6d",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "JAVASCRIPT",
          description: "Seeded Javascript category",
          colorIcon: "#29af8d",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "NPM",
          description: "Seeded NPM category",
          colorIcon: "#22af0d",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("categories", null, {});
  }
};
