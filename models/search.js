"use strict";
module.exports = (sequelize, DataTypes) => {
  const Search = sequelize.define(
    "Search",
    {
      query: DataTypes.STRING,
      UserId: DataTypes.INTEGER
    },
    {}
  );
  // Search.associate = function(models) {
  //   // associations can be defined here
  // };
  return Search;
};
