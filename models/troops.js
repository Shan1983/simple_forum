"use strict";
module.exports = (sequelize, DataTypes) => {
  const Troop = sequelize.define(
    "Troop",
    {
      name: DataTypes.STRING,
      level: DataTypes.INTEGER,
      maxLevel: DataTypes.INTEGER
    },
    {}
  );
  Troop.associate = function(models) {
    Troop.belongsTo(models.Village);
    Troop.belongsTo(models.User);
  };
  return Troop;
};
