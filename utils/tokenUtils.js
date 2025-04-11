import jwt from "jsonwebtoken";

export const createJWT = ({ payload }) => {
  // Set token expiration to 30 days
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

export const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const month = 1000 * 60 * 60 * 24 * 30; // 30 days for access token
  const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6; // 6 months for refresh token

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + month),
    maxAge: month,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + sixMonths),
    maxAge: sixMonths,
  });
};
