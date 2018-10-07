const dotenv = require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    operatorsAliases: false,
    logging: false
  },
  test: {
    username: process.env.DATABASE_USER_TEST,
    password: process.env.DATABASE_PASSWORD_TEST,
    database: process.env.DATABASE_TEST,
    host: process.env.DATABASE_PORT_TEST,
    dialect: process.env.DATABASE_DIALECT_TEST,
    operatorsAliases: false,
    logging: false
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    operatorsAliases: false
  }
};
