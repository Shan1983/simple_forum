'use strict';
module.exports = (sequelize, DataTypes) => {
  const userpost = sequelize.define('userpost', {
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  userpost.associate = function(models) {
    // associations can be defined here
  };
  return userpost;
};