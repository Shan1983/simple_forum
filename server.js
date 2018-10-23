const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(
  expressSession.Store
);
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const passport = require("passport");
const app = express();
// const apiLimiter = require("./helpers/ratelimiting");
const { Setting } = require("./models");
const attributes = require("./helpers/getModelAttributes");

// import the models
const { sequelize } = require("./models");

// import the web socket functions

// config the server port, and session secret
const sessionSecret = process.env.SESSION_SECRET;

// setup express middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/api/", apiLimiter);

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
  .then(response => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Database status: ✅");
    }
  })
  .catch(err => console.log(`Database status: ❌ ${err}`));

// setup proxy if in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// allow express to start the db sessions
app.use(session);

// setup passport auth
app.use(passport.initialize());
require("./services/authentication/passport")(passport);

// the api routes
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/category", require("./routes/category"));
app.use("/api/v1/thread", require("./routes/thread"));
app.use("/api/v1/post", require("./routes/post"));
app.use("/api/v1/ban", require("./routes/ban"));
app.use("/api/v1/like", require("./routes/like"));
app.use("/api/v1/friend", require("./routes/friend"));
app.use("/api/v1/poll", require("./routes/poll"));
app.use("/api/v1/blacklist", require("./routes/blacklist"));
app.use("/api/v1/penaltybox", require("./routes/penaltybox"));
app.use("/api/v1/report", require("./routes/report"));
app.use("/api/v1/setting", require("./routes/setting"));

// setup general error handler
app.use(require("./helpers/generalErrors"));

// 404 errors
app.use((req, res, next) => {
  res.status(404);
  if (req.accepts("json")) {
    res.send({ error: "Not Found." });
    return;
  }
});

// setup the html side for the SPA
// TODO complete this once the frontend is complete

const start = port => {
  const server = app.listen(port, async () => {
    console.log(`🖥  Server has started! on port: ${port}`);

    // setup global vars
    app.locals.started = true; // used for testing

    // initial settings setup
    const data = {
      forumName: "Forum Name",
      forumDescription: "Tell us about what your forum will be used for.",
      clanTag: "#12345",
      clanSize: 50,
      initialSetup: true,
      clanShield: "path/to/clan/shield",
      showDescription: true,
      showClanSize: true,
      showBlacklist: true,
      showClanShield: true,
      maintenance: false,
      lockForum: true,
      allowBestPosts: true,
      emailSubscriptionparticipants: true,
      repostingDuration: 3,
      allowLikes: true,
      editor: "Plain Editor",
      setAdminUser: 1,
      setMaxDiscussionWordLimit: 1024,
      allowSubscriptions: true,
      allowStickyThreads: true
    };

    const settings = await Setting.findById(1);
    const settingReq = attributes.convert(settings);
    if (!settingReq.init) {
      await Setting.initialSetup(data);
    }
    // setup express with the base varibles
    app.locals.forumName = settingReq.forumName;
    app.locals.forumDescription = settingReq.forumDescription;
    app.locals.clanTag = settingReq.clanTag;
    app.locals.clanSize = settingReq.clanSize;
    app.locals.initialSetup = settingReq.initialSetup;
    app.locals.clanShield = settingReq.clanShield;
    app.locals.showDescription = settingReq.showDescription;
    app.locals.showClanSize = settingReq.showClanSize;
    app.locals.showBlacklist = settingReq.showBlacklist;
    app.locals.showClanShield = settingReq.showClanShield;
    app.locals.maintenance = settingReq.maintenance;
    app.locals.lockForum = settingReq.lockForum;
    app.locals.allowBestPosts = settingReq.allowBestPosts;
    app.locals.emailSubscriptionparticipants =
      settingReq.emailSubscriptionparticipants;
    app.locals.repostingDuration = settingReq.repostingDuration;
    app.locals.allowLikes = settingReq.allowLikes;
    app.locals.editor = settingReq.editor;
    app.locals.setAdminUser = settingReq.setAdminUser;
    app.locals.setMaxDiscussionWordLimit = settingReq.setMaxDiscussionWordLimit;
    app.locals.allowSubscriptions = settingReq.allowSubscriptions;
    app.locals.allowStickyThreads = settingReq.allowStickyThreads;

    // emit started event..
  });
};

// server config
if (process.env.NODE_ENV === "test") {
  const port = 8888;
  start(port);
} else {
  const port = process.env.PORT || 3000;
  // lets get this party started
  start(port);
}

module.exports = app;
