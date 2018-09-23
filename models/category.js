'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    colorIcon: DataTypes.STRING
  }, {});
  category.associate = function(models) {
    // associations can be defined here
  };
  return category;
};