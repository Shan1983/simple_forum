'use strict';
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    discussion: DataTypes.TEXT,
    postPosition: DataTypes.INTEGER,
    removed: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    ThreadId: DataTypes.INTEGER,
    bestPost: DataTypes.INTEGER
  }, {});
  post.associate = function(models) {
    // associations can be defined here
  };
  return post;
};