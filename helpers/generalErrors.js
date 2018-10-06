const { Sequelize } = require("../models");
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
module.exports = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    res.status(400);
    res.json(err);
  } else if (err.name in errors) {
    res.status(err.status);
    res.json({ errors: [err] });
  } else {
    console.log(`/!\\ ${err} /!\\`.red);
    res.status(500);
    res.json({ errors: [errors.unknown] });
  }
};
