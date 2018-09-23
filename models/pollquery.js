'use strict';
module.exports = (sequelize, DataTypes) => {
  const pollQuery = sequelize.define('pollQuery', {
    question: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    duration: DataTypes.INTEGER
  }, {});
  pollQuery.associate = function(models) {
    // associations can be defined here
  };
  return pollQuery;
};