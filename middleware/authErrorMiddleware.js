/**
 * Custom middleware to handle authentication errors
 * This middleware logs authentication errors and provides more detailed information
 */

const authErrorMiddleware = (err, req, res, next) => {
  // Check if this is an authentication error
  if (err && (err.name === 'AuthenticationError' || err.message.includes('authentication'))) {
    console.error('Authentication Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      headers: {
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for'],
        host: req.headers.host,
        referer: req.headers.referer
      }
    });

    // If this is an API request, return JSON error
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: err.message || 'Authentication error occurred'
      });
    }

    // For non-API requests, redirect to login page with error
    return res.redirect(`${process.env.CLIENT_URL}/auth/sign-in?error=authentication_failed`);
  }

  // Pass to next error handler if not an authentication error
  next(err);
};

export default authErrorMiddleware;
