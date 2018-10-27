const { GeneralLog, Sequelize } = require("../models");
const errors = require("./mainErrors");

const colors = require("colors");
/**
 * Handles any errors that are passed to next, and those
 * that are not caught elsewhere.
 * @param {String} err
 * @param {Request} req
 * @param {Response} res
 * @param {Middleware} next
 */
const logError = async (err, req, res) => {
  await GeneralLog.create({
    ip: req.ip,
    UserId: req.session.userId,
    path: req.originalUrl,
    type: "error",
    method: "ERROR",
    status: res.statusCode,
    message: err.name
  });
};
module.exports = async (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    res.status(400);
    await logError(err, req, res);
    res.json(err, req);
  } else if (err.name in errors) {
    res.status(err.status);
    await logError(err, req, res);
    res.json({ errors: [err] });
  } else {
    console.log(`/!\\ ${err} /!\\`.red);
    res.status(500);
    await logError(err, req, res);
    res.json({ errors: [errors.unknown] });
  }
};
