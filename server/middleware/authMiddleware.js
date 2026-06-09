import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User reference not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token processing verification failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: Token missing' });
  }
};

export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ success: false, message: `Access Forbidden: Requires ${role} role privileges` });
    }
  };
};
