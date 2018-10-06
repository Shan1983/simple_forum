"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "villages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        UserId: { type: Sequelize.INTEGER },
        townhallLevel: { type: Sequelize.INTEGER },
        TroopsId: { type: Sequelize.INTEGER },
        league: { type: Sequelize.INTEGER },
        builderTownhallLevel: { type: Sequelize.INTEGER },
        playerTag: { type: Sequelize.STRING },
        expLevel: { type: Sequelize.INTEGER },
        leagueIcon: { type: Sequelize.STRING },
        trophies: { type: Sequelize.INTEGER },
        versusTrophies: { type: Sequelize.INTEGER },
        attackWins: { type: Sequelize.INTEGER },
        defenceWins: { type: Sequelize.INTEGER },
        clanTag: { type: Sequelize.STRING },
        clanBadgeUrl: { type: Sequelize.STRING },
        donations: { type: Sequelize.INTEGER },
        donationsReceived: { type: Sequelize.INTEGER },
        warStars: { type: Sequelize.INTEGER },
        clanRole: { type: Sequelize.STRING },
        SpellsId: { type: Sequelize.INTEGER },
        HeroesId: { type: Sequelize.INTEGER },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      },
      { charset: "utf8mb4" }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("villages");
  }
};
