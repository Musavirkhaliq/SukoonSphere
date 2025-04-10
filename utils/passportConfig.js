import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with the same email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Update existing user with Google ID
          user.googleId = profile.id;
          user.socialProvider = 'google';
          if (!user.isVerified) {
            user.isVerified = true;
            user.verified = new Date();
          }
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          socialProvider: 'google',
          isVerified: true,
          verified: new Date(),
          avatar: profile.photos[0]?.value || ''
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/v1/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with the same email
        if (profile.emails && profile.emails[0]) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Update existing user with Facebook ID
            user.facebookId = profile.id;
            user.socialProvider = 'facebook';
            if (!user.isVerified) {
              user.isVerified = true;
              user.verified = new Date();
            }
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`,
          facebookId: profile.id,
          socialProvider: 'facebook',
          isVerified: true,
          verified: new Date(),
          avatar: profile.photos[0]?.value || ''
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Twitter Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/api/v1/auth/twitter/callback',
      includeEmail: true
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ twitterId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with the same email
        if (profile.emails && profile.emails[0]) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Update existing user with Twitter ID
            user.twitterId = profile.id;
            user.socialProvider = 'twitter';
            if (!user.isVerified) {
              user.isVerified = true;
              user.verified = new Date();
            }
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : `${profile.id}@twitter.com`,
          twitterId: profile.id,
          socialProvider: 'twitter',
          isVerified: true,
          verified: new Date(),
          avatar: profile.photos[0]?.value || ''
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
