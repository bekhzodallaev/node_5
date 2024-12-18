require('dotenv').config();

const jwt = require('jsonwebtoken');
const managerModel = require('../models/managerModel'); // Ensure this path is correct

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Authorization header is missing or invalid' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // Find the user by ID
    const manager = managerModel.findById(decoded.id);
    if (!manager) {
      return res
        .status(403)
        .json({ message: 'User not found or token invalid' });
    }

    // Attach the user to the request object
    req.user = manager;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
