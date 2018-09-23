'use strict';
module.exports = (sequelize, DataTypes) => {
  const like = sequelize.define('like', {
    UserId: DataTypes.INTEGER,
    ThreadId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER
  }, {});
  like.associate = function(models) {
    // associations can be defined here
  };
  return like;
};