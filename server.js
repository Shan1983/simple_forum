const express = require("express");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(expressSession);
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// import the models
const { sequelize } = require("./models");

// import the web socket functions
