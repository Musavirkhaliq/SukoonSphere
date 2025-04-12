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
  try {
    // Validate inputs
    if (!res || !user) {
      console.error('attachCookiesToResponse: Missing required parameters', { hasRes: !!res, hasUser: !!user });
      throw new Error('Missing required parameters for cookie attachment');
    }

    // Log user info for debugging
    console.log('Attaching cookies for user:', {
      userId: user._id || user.userId,
      role: user.role
    });

    const accessTokenJWT = createJWT({ payload: { user } });
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

    const month = 1000 * 60 * 60 * 24 * 30; // 30 days for access token
    const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6; // 6 months for refresh token

    // Set cookies with SameSite and domain options for cross-site compatibility
    res.cookie("accessToken", accessTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + month),
      maxAge: month,
      sameSite: 'lax' // Allow cookies to be sent in cross-site requests
    });

    res.cookie("refreshToken", refreshTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + sixMonths),
      maxAge: sixMonths,
      sameSite: 'lax' // Allow cookies to be sent in cross-site requests
    });

    console.log('Cookies attached successfully');
  } catch (error) {
    console.error('Error attaching cookies to response:', error);
    throw error; // Re-throw to be handled by the caller
  }
};
