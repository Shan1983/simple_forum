"use strict";
module.exports = (sequelize, DataTypes) => {
  const Spell = sequelize.define(
    "Spell",
    {
      name: DataTypes.STRING,
      level: DataTypes.INTEGER,
      maxLevel: DataTypes.INTEGER
    },
    {}
  );
  Spell.associate = function(models) {
    Spell.belongsTo(models.Village);
    Spell.belongsTo(models.User);
  };
  return Spell;
};
