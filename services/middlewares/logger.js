const { GeneralLog } = require("../../models");

exports.general = async (req, res, next) => {
  try {
    await GeneralLog.create({
      ip: req.ip,
      UserId: req.session.userId,
      path: req.originalUrl,
      type: "info",
      method: req.method || "ERROR",
      status: res.statusCode,
      message: "OK"
    });

    next();
  } catch (error) {
    next(error);
  }
};
