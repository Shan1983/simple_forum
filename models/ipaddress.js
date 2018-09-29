"use strict";
module.exports = (sequelize, DataTypes) => {
  const IpAddress = sequelize.define(
    "IpAddress",
    {
      ipaddress: {
        type: DataTypes.STRING,
        validate: {
          isIp: true
        }
      },
      UserId: DataTypes.INTEGER
    },
    {}
  );

  // class methods

  IpAddress.associate = function(models) {
    IpAddress.belongsToMany(models.User, { throught: "UserIp" });
  };

  IpAddress.createIpIfEmpty = async function(ip, user) {
    const { User } = sequelize.models;
    // get ip if user had one already
    const ip = await IpAddress.findOne({
      where: { ipaddress: ip },
      include: [{ model: User, where: { id: user.id } }]
    });

    if (!ip) {
      const newIp = await IpAddress.create({
        ipaddress: ip
      });
      await newIp.addUser(user);
    }
  };

  return IpAddress;
};
