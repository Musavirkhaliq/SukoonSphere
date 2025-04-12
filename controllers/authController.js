import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import RefreshToken from "../models/token/token.js";
import {
  comparePassword,
  hashpasword,
  hashString,
} from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErors.js";
import { createJWT, attachCookiesToResponse, verifyJWT } from "../utils/tokenUtils.js";
import crypto from "crypto";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";
import sendResetPasswordEmail from "../utils/sendResetPasswordEmail.js";
import passport from '../utils/passportConfig.js';

// register
export const register = async (req, res) => {
  const isFirst = (await User.countDocuments()) === 0;
  req.body.role = isFirst ? "admin" : "user";
  req.body.password = await hashpasword(req.body.password);
  req.body.verificationToken = crypto.randomBytes(20).toString("hex");

  const user = await User.create(req.body);
  const origin = "http://localhost:5173";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Success! please check your email to verify account",
  });
};

// verify-email
export const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("verification failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("verification failed");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "email verified" });
};

// login
export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError("invalid Credentials");
  if (!user.isVerified)
    throw new UnauthenticatedError(
      "please verify your email, you have already recieved verification link, check your mail"
    );

  let refreshToken = "";
  const existingToken = await RefreshToken.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("invalid credentials");
    }
    refreshToken = existingToken.refreshToken;
  } else {
    refreshToken = crypto.randomBytes(50).toString("hex");
    const userAgent = req.headers["user-agent"] || 'Unknown';
    // Get IP address, accounting for proxies
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    const userToken = { refreshToken, ipAddress, userAgent, user: user._id };
    console.log('Creating refresh token for regular login:', { userId: user._id, ipAddress });
    await RefreshToken.create(userToken);
  }

  // Get user profile data
  const userProfile = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,

  };

  attachCookiesToResponse({
    res,
    user,
    refreshToken,
  });

  res.status(StatusCodes.OK).json({
    msg: "user logged in",
    user: userProfile,
    isAuthenticated: true
  });
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = verifyJWT(refreshToken);
    const existingToken = await RefreshToken.findOne({
      user: payload.user._id,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    res.status(StatusCodes.OK).json({ msg: "Access token refreshed" });
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) throw new UnauthenticatedError("Password reset request failed.");

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("invalid Credentials");

  if (req.body.newPassword !== req.body.confirmNewPassword) {
    throw new UnauthenticatedError("New passwords do not match.");
  }

  if (!user.isVerified)
    throw new UnauthenticatedError("please verify your email");

  const hashedPassword = await hashpasword(req.body.newPassword);
  user.password = hashedPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "password changed sucessfully" });
};

// forget password
export const forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = "http://localhost:5173";
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res.status(StatusCodes.OK).json({
    msg: "Success! please check your email for reset password link",
  });
};
// resetpassword
export const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      const hashedPassword = await hashpasword(password);
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      user.password = hashedPassword;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: "password changed sucessfully" });
};

// logout
export const logout = async (req, res) => {
  // If user exists in request, delete their refresh token
  if (req.user?.userId) {
    await RefreshToken.findOneAndDelete({ user: req.user.userId });
  }

  // Clear cookies regardless of authentication state
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    signed: true
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    signed: true
  });

  res.status(StatusCodes.OK).json({
    msg: "user logged out!",
    isAuthenticated: false
  });
};

// Social Authentication Handlers

// Google Authentication
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    // Log detailed error information
    if (err) {
      console.error('Google authentication error:', err);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=authentication_failed`);
    }

    if (!user) {
      console.error('Google authentication: No user returned', info);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=user_not_found`);
    }

    try {
      console.log('Google auth: Creating session for user:', { id: user._id, role: user.role });

      // Create token user object with proper format
      // Make sure we include all required user properties for the JWT
      const tokenUser = {
        _id: user._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      console.log('Google auth: Created tokenUser object');

      const refreshToken = crypto.randomBytes(40).toString('hex');
      console.log('Google auth: Generated refresh token');

      // Get IP address, accounting for proxies
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
      console.log('Google auth: Got IP address:', ipAddress);

      // Create user token object
      const userToken = {
        refreshToken,
        ipAddress: ipAddress, // Changed from 'ip' to 'ipAddress' to match schema
        userAgent: req.headers['user-agent'] || 'Unknown',
        user: user._id
      };
      console.log('Google auth: Created userToken object');

      // Save refresh token to database
      await RefreshToken.create(userToken);
      console.log('Google auth: Saved refresh token to database');

      // Attach cookies to response
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      console.log('Google auth: Attached cookies to response');

      // Redirect to frontend with success
      console.log('Google auth: Redirecting to success URL');
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?success=true`);
    } catch (error) {
      console.error('Error creating session after Google auth:', error);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=server_error`);
    }
  })(req, res, next);
};

// Facebook Authentication
export const facebookAuth = passport.authenticate('facebook', { scope: ['email'] });

export const facebookAuthCallback = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, async (err, user, info) => {
    // Log detailed error information
    if (err) {
      console.error('Facebook authentication error:', err);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=authentication_failed`);
    }

    if (!user) {
      console.error('Facebook authentication: No user returned', info);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=user_not_found`);
    }

    try {
      console.log('Facebook auth: Creating session for user:', { id: user._id, role: user.role });

      // Create token user object with proper format
      const tokenUser = {
        _id: user._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      console.log('Facebook auth: Created tokenUser object');

      const refreshToken = crypto.randomBytes(40).toString('hex');
      console.log('Facebook auth: Generated refresh token');

      // Get IP address, accounting for proxies
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
      console.log('Facebook auth: Got IP address:', ipAddress);

      // Create user token object
      const userToken = {
        refreshToken,
        ipAddress: ipAddress,
        userAgent: req.headers['user-agent'] || 'Unknown',
        user: user._id
      };
      console.log('Facebook auth: Created userToken object');

      // Save refresh token to database
      await RefreshToken.create(userToken);
      console.log('Facebook auth: Saved refresh token to database');

      // Attach cookies to response
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      console.log('Facebook auth: Attached cookies to response');

      // Redirect to frontend with success
      console.log('Facebook auth: Redirecting to success URL');
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?success=true`);
    } catch (error) {
      console.error('Error creating session after Facebook auth:', error);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=server_error`);
    }
  })(req, res, next);
};

// Twitter Authentication
export const twitterAuth = passport.authenticate('twitter');

export const twitterAuthCallback = (req, res, next) => {
  passport.authenticate('twitter', { session: false }, async (err, user, info) => {
    // Log detailed error information
    if (err) {
      console.error('Twitter authentication error:', err);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=authentication_failed`);
    }

    if (!user) {
      console.error('Twitter authentication: No user returned', info);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=user_not_found`);
    }

    try {
      console.log('Twitter auth: Creating session for user:', { id: user._id, role: user.role });

      // Create token user object with proper format
      const tokenUser = {
        _id: user._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      console.log('Twitter auth: Created tokenUser object');

      const refreshToken = crypto.randomBytes(40).toString('hex');
      console.log('Twitter auth: Generated refresh token');

      // Get IP address, accounting for proxies
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
      console.log('Twitter auth: Got IP address:', ipAddress);

      // Create user token object
      const userToken = {
        refreshToken,
        ipAddress: ipAddress,
        userAgent: req.headers['user-agent'] || 'Unknown',
        user: user._id
      };
      console.log('Twitter auth: Created userToken object');

      // Save refresh token to database
      await RefreshToken.create(userToken);
      console.log('Twitter auth: Saved refresh token to database');

      // Attach cookies to response
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      console.log('Twitter auth: Attached cookies to response');

      // Redirect to frontend with success
      console.log('Twitter auth: Redirecting to success URL');
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?success=true`);
    } catch (error) {
      console.error('Error creating session after Twitter auth:', error);
      return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=server_error`);
    }
  })(req, res, next);
};