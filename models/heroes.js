"use strict";
module.exports = (sequelize, DataTypes) => {
  const Hero = sequelize.define(
    "Hero",
    {
      name: DataTypes.STRING,
      level: DataTypes.INTEGER,
      maxLevel: DataTypes.INTEGER
    },
    {}
  );
  Hero.associate = function(models) {
    Hero.belongsTo(models.Village);
    Hero.belongsTo(models.User);
  };
  return Hero;
};
