'use strict';
module.exports = (sequelize, DataTypes) => {
  const session = sequelize.define('session', {
    sid: DataTypes.INTEGER,
    lapses: DataTypes.DATE,
    information: DataTypes.TEXT
  }, {});
  session.associate = function(models) {
    // associations can be defined here
  };
  return session;
};