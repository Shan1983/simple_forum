"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "threads",
      [
        {
          title: "test",
          slug: "test",
          postCount: "0",
          locked: false,
          CategoryId: 1,
          UserId: 1,
          titleBGColor: "#ffffff",
          discussion: "<p>test test test test</p>",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "Javascript Rocks",
          slug: "javascript-rocks",
          postCount: "0",
          locked: false,
          CategoryId: 2,
          UserId: 1,
          titleBGColor: "#ffffff",
          discussion: "<p>It does everything.. wow!</p>",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "npm is kinda cool",
          slug: "npm-is-kinda-cool",
          postCount: "0",
          locked: false,
          CategoryId: 3,
          UserId: 1,
          titleBGColor: "#ffffff",
          discussion: "<p>something about npm here...</p>",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "deleted thread",
          slug: "deleted-thread",
          postCount: "0",
          locked: false,
          CategoryId: 3,
          UserId: 1,
          titleBGColor: "#ffffff",
          discussion: "<p>deleted</p>",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("threads", null, {});
  }
};
