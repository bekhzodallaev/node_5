require('dotenv').config();

const jwt = require('jsonwebtoken');
const managerModel = require('../models/managerModel');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Authorization header is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const manager = managerModel.findById(decoded.id);
    if (!manager) {
      return res
        .status(403)
        .json({ message: 'User not found or token invalid' });
    }

    req.user = manager;

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const checkRole = (allowedSuper) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    if (allowedSuper && !req.user.super) {
      return res
        .status(403)
        .json({ message: 'Access denied, Superuser role required.' });
    }

    next();
  };
};

module.exports = { authMiddleware, checkRole };
