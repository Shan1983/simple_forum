"use strict";
module.exports = (sequelize, DataTypes) => {
  const Village = sequelize.define(
    "Village",
    {
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
    },
    {}
  );
  Village.associate = function(models) {
    Village.belongsTo(models.User);
    Village.hasOne(models.Troop);
    Village.hasOne(models.Hero);
    Village.hasOne(models.Spell);
  };
  return Village;
};
