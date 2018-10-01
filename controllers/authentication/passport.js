const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwtHelper = require("../../helpers/jwtHelper.js");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// grab the user model
const { User } = require("../../models");
const errors = require("../../helpers/mainErrors");

module.exports = app => {
  app.use(passport.initialize());

  // setup auth via JWT

  //   const cookieExtractor = req => {
  //     if (req && req.cookies && req.cookies.jwt_token) {
  //       return req.cookies.jwt_token;
  //     }

  //     return errors.notAuthorized;
  //   };

  const jwtOptions = {
    // where does passport get the auth headers?
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // wherte does passport get the jwt secret/key ?
    secretOrKey: jwtHelper.getJwtSecret()
  };

  // setup the jwt strategy
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await User.findOne({ where: { id: payload.id } });
        console.log(user);
        if (!user) {
          done(null, false);
        } else {
          done(null, user);
        }
      } catch (error) {
        console.log("JwtStrategy Error: ", error);
        done(error, false);
      }
    })
  );
};
