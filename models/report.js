'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    ThreadId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER,
    reason: DataTypes.ENUM,
    complaint: DataTypes.TEXT,
    submittedBy: DataTypes.INTEGER
  }, {});
  report.associate = function(models) {
    // associations can be defined here
  };
  return report;
};