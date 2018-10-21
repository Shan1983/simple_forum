"use strict";
module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define(
    "Blacklist",
    {
      playerTag: DataTypes.STRING,
      currentName: DataTypes.STRING,
      previousName: DataTypes.STRING,
      reason: DataTypes.TEXT
    },
    {}
  );

  // class methods

  return Blacklist;
};
