const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const passportConfig = (passport) => {
  passport.use(
    new OAuth2Strategy(
      {
        clientID: process.env.GOOGLE_SECRET_ID,
        clientSecret: process.env.GOOGLE_SECRET_KEY,
        callbackURL: `${process.env.BACKEND_URL}/google/callback`,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ googleId: profile.id });

          if (!user) {
            user = new userModel({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePhoto: profile.photos[0].value,
              role: "GENERAL",
            });

            await user.save();
          }

          const tokenData = {
            _id: user._id,
            email: user.email,
          };

          const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
            expiresIn: '8h',
          });

          const tokenOption = {
            httpOnly: true,
            secure: true, // or false if you are not using https
            sameSite: "none",
          };

          return done(null, { user, token, tokenOption });
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = passportConfig;
