"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          username: "Shan",
          email: "shan@test.com",
          colorIcon: "#000000",
          password: bcrypt.hashSync("secret", 10),
          emailVerificationToken: "123456789",
          emailVerified: true,
          RoleId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};