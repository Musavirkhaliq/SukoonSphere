import { UnauthenticatedError } from "../errors/customErors.js";
import { attachCookiesToResponse, verifyJWT } from "../utils/tokenUtils.js";
import RefreshToken from "../models/token/token.js";

export const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken);
      req.user = payload.user;
      req.user.userId = payload.user._id;
      req.user.username = payload.user.name 
      return next();
    }
    const payload = verifyJWT(refreshToken);
    const existingToken = await RefreshToken.findOne({
      user: payload.user._id,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("authentication invalid");
    }
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    req.user.userId = payload.user._id;
      req.user.username = payload.user.name;
    next();
  } catch {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const optionalAuthenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  
  // If no tokens present, continue without authentication
  if (!accessToken && !refreshToken) {
    return next();
  }

  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken);
      req.user = payload.user;
      req.user.userId = payload.user._id;
      req.user.username = payload.user.name;
      return next();
    }

    const payload = verifyJWT(refreshToken);
    const existingToken = await RefreshToken.findOne({
      user: payload.user._id,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      // If refresh token is invalid, continue without authentication
      return next();
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    req.user.userId = payload.user._id;
    req.user.username = payload.user.name;
    next();
  } catch {
    // If token verification fails, continue without authentication
    next();
  }
};

// export const authenticateUser = async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) throw new UnauthenticatedError("authentication invalid");
//   try {
//     const { userId, role, username, email, avatar } = verifyJWT(token);
//     req.user = { userId, username, role, email, avatar };
//     next();
//   } catch {
//     throw new UnauthenticatedError("authentication invalid");
//   }
// };
