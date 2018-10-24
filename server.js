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
const setting = require("./helpers/settingsHelper");
const reward = require("./helpers/rewardHelper");

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

    const settings = await setting.intialSettingSetup();
    const rewards = await reward.intialRewardsSetup();

    // setup express with the base varibles
    app.locals.forumName = settings.forumName;
    app.locals.forumDescription = settings.forumDescription;
    app.locals.clanTag = settings.clanTag;
    app.locals.clanSize = settings.clanSize;
    app.locals.initialSetup = settings.initialSetup;
    app.locals.clanShield = settings.clanShield;
    app.locals.showDescription = settings.showDescription;
    app.locals.showClanSize = settings.showClanSize;
    app.locals.showBlacklist = settings.showBlacklist;
    app.locals.showClanShield = settings.showClanShield;
    app.locals.maintenance = settings.maintenance;
    app.locals.lockForum = settings.lockForum;
    app.locals.allowBestPosts = settings.allowBestPosts;
    app.locals.emailSubscriptionparticipants =
      settings.emailSubscriptionparticipants;
    app.locals.repostingDuration = settings.repostingDuration;
    app.locals.allowLikes = settings.allowLikes;
    app.locals.editor = settings.editor;
    app.locals.setAdminUser = settings.setAdminUser;
    app.locals.setMaxDiscussionWordLimit = settings.setMaxDiscussionWordLimit;
    app.locals.allowSubscriptions = settings.allowSubscriptions;
    app.locals.allowStickyThreads = settings.allowStickyThreads;

    // reward locals
    app.locals.pointsPerPost = rewards.pointsPerPost;
    app.locals.pointsPerThread = rewards.pointsPerThread;
    app.locals.pointsPerLike = rewards.pointsPerLike;
    app.locals.pointsPerBestPost = rewards.pointsPerBestPost;
    app.locals.pointsForAdvertising = rewards.pointsForAdvertising;
    app.locals.pointsPerPollQuestion = rewards.pointsPerPollQuestion;
    app.locals.pointsPerPollVote = rewards.pointsPerPollVote;

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
