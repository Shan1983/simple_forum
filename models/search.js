'use strict';
module.exports = (sequelize, DataTypes) => {
  const search = sequelize.define('search', {
    query: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  search.associate = function(models) {
    // associations can be defined here
  };
  return search;
};