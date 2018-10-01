const { Sequelize } = require("../models");
const errors = require("./mainErrors");

module.exports = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    res.status(400);
    res.json(err);
  } else if (err.name in errors) {
    res.status(err.status);
    res.json({ errors: [err] });
  } else {
    console.log(`/!\\ ${err} /!\\`);
    res.status(500);
    res.json({ errors: [errors.unknown] });
  }
};
