// googleStrategy.js
const passport = require("passport");
const dotenv = require("dotenv");
const userModel = require("../models/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos[0].value,
          });
        }
        console.log(user);
        return cb(null, user);
      } catch (err) {
        console.error("Google Strategy Error:", err);
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id); // Use _id instead of id for MongoDB
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await userModel.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
});

module.exports = passport;