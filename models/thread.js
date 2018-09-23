'use strict';
module.exports = (sequelize, DataTypes) => {
  const thread = sequelize.define('thread', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    postCount: DataTypes.INTEGER,
    locaked: DataTypes.BOOLEAN,
    CategoryId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    PollQueryId: DataTypes.INTEGER,
    titleBGColor: DataTypes.STRING,
    discussion: DataTypes.TEXT
  }, {});
  thread.associate = function(models) {
    // associations can be defined here
  };
  return thread;
};