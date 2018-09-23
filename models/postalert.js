'use strict';
module.exports = (sequelize, DataTypes) => {
  const postAlert = sequelize.define('postAlert', {
    UserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER,
    AlertId: DataTypes.INTEGER
  }, {});
  postAlert.associate = function(models) {
    // associations can be defined here
  };
  return postAlert;
};