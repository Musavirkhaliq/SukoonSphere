import { UnauthenticatedError, UnauthorizedError } from "../errors/customErors.js";
import { attachCookiesToResponse, verifyJWT } from "../utils/tokenUtils.js";
import RefreshToken from "../models/token/token.js";
import { StatusCodes } from "http-status-codes";

export const profileMiddleware = (allowedRoles) => async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken);
      req.user = payload.user;
      req.user.userId = payload.user._id;
      
      // If roles are specified, check if user has required role
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(req.user.role)) {
          throw new UnauthorizedError('Not authorized to access this route');
        }
      }
      
      return next();
    }
    const payload = verifyJWT(refreshToken);
    const existingToken = await RefreshToken.findOne({
      user: payload.user._id,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError('Authentication Invalid');
    }
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    
    // If roles are specified, check if user has required role
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(req.user.role)) {
        throw new UnauthorizedError('Not authorized to access this route');
      }
    }
    
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};
