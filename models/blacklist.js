"use strict";
module.exports = (sequelize, DataTypes) => {
  const Blacklist = sequelize.define(
    "Blacklist",
    {
      playerTag: DataTypes.STRING,
      currentName: DataTypes.STRING,
      previousName: DataTypes.STRING,
      reason: DataTypes.TEXT
    },
    {}
  );

  // class methods

  Blacklist.associate = function(models) {
    Blacklist.belongsTo(models.User);
  };

  Blacklist.addUser = function(tag, name, reason) {
    Blacklist.create({
      tag,
      currentName: name,
      reason,
      previousName: name
    });
  };

  // instance methods
  Blacklist.prototype.removeUser = async function(name) {
    const { Blacklist } = sequelize.models;

    const bl = await Blacklist.findOne({
      where: { currentName: name }
    });

    bl.destroy();

    return true;
  };

  return Blacklist;
};
