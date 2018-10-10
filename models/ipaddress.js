"use strict";
module.exports = (sequelize, DataTypes) => {
  const IpAddress = sequelize.define(
    "IpAddress",
    {
      ipAddress: {
        type: DataTypes.STRING
      },
      UserId: DataTypes.INTEGER
    },
    {}
  );

  // class methods

  IpAddress.associate = function(models) {
    IpAddress.belongsToMany(models.User, { through: "userip" });
  };

  IpAddress.createIpIfEmpty = async function(ip, id) {
    const { User } = sequelize.models;
    // get ip if user had one already
    const ipa = await IpAddress.findOne({
      where: { UserId: id }
    });

    if (!ipa) {
      await IpAddress.create({ ipAddress: ip, UserId: id });
    }
  };

  return IpAddress;
};
