import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'adaptcx_default_jwt_secret_dev_2026_super_secure';

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtErr) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    if (!decoded || !decoded.businessId) {
      return res.status(401).json({ message: 'Invalid token payload.' });
    }

    // Verify business exists in database
    const business = await db.getBusinessById(decoded.businessId);
    if (!business) {
      return res.status(401).json({ message: 'Business account not found.' });
    }

    req.businessId = business.id;
    req.business = business;
    next();
  } catch (error) {
    console.error('requireAuth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error in authentication.' });
  }
};
