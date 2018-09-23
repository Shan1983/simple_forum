'use strict';
module.exports = (sequelize, DataTypes) => {
  const village = sequelize.define('village', {
    townhallLevel: DataTypes.INTEGER,
    TroopsId: DataTypes.INTEGER,
    league: DataTypes.INTEGER,
    builderTownhallLevel: DataTypes.INTEGER,
    playerTag: DataTypes.STRING,
    expLevel: DataTypes.INTEGER,
    leagueIcon: DataTypes.STRING,
    trophies: DataTypes.INTEGER,
    versusTrophies: DataTypes.INTEGER,
    attackWins: DataTypes.INTEGER,
    defenceWins: DataTypes.INTEGER,
    clanTag: DataTypes.STRING,
    clanBadgeUrl: DataTypes.STRING,
    donations: DataTypes.INTEGER,
    donationsReceived: DataTypes.INTEGER,
    warStars: DataTypes.INTEGER,
    clanRole: DataTypes.STRING,
    SpellsId: DataTypes.INTEGER,
    HeroesId: DataTypes.INTEGER
  }, {});
  village.associate = function(models) {
    // associations can be defined here
  };
  return village;
};