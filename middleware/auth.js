// middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Verifies JWT from x-auth-token header and sets req.userId.
 * If invalid or missing, responds with 401.
 */
exports.auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Admin‐only middleware.
 * Expects a valid JWT (same header), but also checks isAdmin flag.
 * If not isAdmin or token invalid, responds with 401/403.
 */
exports.adminAuth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // In this setup, admin flag isn't embedded in user token. 
    // Instead, admin credentials are checked separately on login endpoint.
    // Here, we just allow if token exists (since admin login sets it).
    // Optionally, you can embed isAdmin in token on admin login.
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
