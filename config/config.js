const dotenv = require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    operatorsAliases: false
  },
  test: {
    username: "root",
    password: null,
    database: "test",
    host: "127.0.0.1",
    dialect: "mysql",
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
