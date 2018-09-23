'use strict';
module.exports = (sequelize, DataTypes) => {
  const pollResponse = sequelize.define('pollResponse', {
    response: DataTypes.STRING,
    PollQueryId: DataTypes.INTEGER
  }, {});
  pollResponse.associate = function(models) {
    // associations can be defined here
  };
  return pollResponse;
};