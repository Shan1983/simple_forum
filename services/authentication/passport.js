const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const jwtHelper = require("../../helpers/jwtHelper");
const { User } = require("../../models");

let options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtHelper.getJwtSecret();

// jtw strategy

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({
          where: { id: jwt_payload.id }
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        console.log("JwtStrategy Error: ", error);
        return done(error, false);
      }
    })
  );
};
