const express = require("express");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(
  expressSession.Store
);
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// import the models
const { sequelize } = require("./models");

// import the web socket functions

// config the server port, and session secret
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

// setup express middleware
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup the sequelize session
const sessionStore = new SequelizeStore({ db: sequelize });
const session = expressSession({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true,
  store: sessionStore
});

// sync the initial db connection
sessionStore
  .sync()
  .then(response => console.log("Database status: ✅"))
  .catch(err => console.log(`Database status: ❌ ${err}`));

// setup proxy if in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// allow express to start the db sessions
app.use(session);

// the api routes
// app.use("/api/v1/test", require("./routes/test"));
app.use("/api/v1/user", require("./routes/user"));

// setup general error handler
app.use(require("./helpers/generalErrors"));

// setup the html side for the SPA
// TODO complete this once the frontend is complete

const start = () => {
  const server = app.listen(port, () => {
    console.log(`🖥  Server has started! on port: ${port}`);

    // setup global vars
    app.locals.started = true; // used for testing

    // emit started event..
  });
};

// server config
if (process.env.NODE_ENV === "test") {
  // sync the db
  sequelize
    .sync({ force: true })
    .then(start)
    .catch(err => console.log(err));
} else {
  // lets get this party started
  start();
}

module.exports = app;
