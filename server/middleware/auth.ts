import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to authenticate requests using JWT from NextAuth
 * Expects Authorization header with Bearer token
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // First check X-User-Id header (from NextAuth session)
  const userIdHeader = req.headers['x-user-id'];
  if (userIdHeader && typeof userIdHeader === 'string') {
    req.userId = userIdHeader;
    return next();
  }

  // Fall back to JWT token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for endpoints that work with or without authentication
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // First check X-User-Id header (from NextAuth session)
  const userIdHeader = req.headers['x-user-id'];
  if (userIdHeader && typeof userIdHeader === 'string') {
    req.userId = userIdHeader;
    return next();
  }

  // Fall back to JWT token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
  } catch (error) {
    // Ignore invalid tokens for optional auth
  }

  next();
}
