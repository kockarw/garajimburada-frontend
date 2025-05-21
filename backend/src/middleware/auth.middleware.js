const { verifyToken } = require('../utils/jwt.utils');
const { User } = require('../models');

/**
 * Middleware to authenticate user using JWT
 */
const authenticate = async (req, res, next) => {
  // Get the token from authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }

  try {
    // Find user by id from token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};

/**
 * Middleware to check if user is either admin or garage owner
 */
const isAdminOrGarageOwner = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'garage_owner')) {
    return res.status(403).json({ message: 'Forbidden - Admin or garage owner access required' });
  }
  next();
};

/**
 * Middleware to check if user owns the garage
 */
const isGarageOwner = (req, res, next) => {
  const garageId = req.params.id;
  if (!garageId) {
    return res.status(400).json({ message: 'Garage ID is required' });
  }

  // Find the garage and check if the user is the owner
  const { Garage } = require('../models');
  Garage.findByPk(garageId)
    .then(garage => {
      if (!garage) {
        return res.status(404).json({ message: 'Garage not found' });
      }

      // Check if the user is admin or the garage owner
      if (req.user.role === 'admin' || garage.user_id === req.user.id) {
        next();
      } else {
        return res.status(403).json({ message: 'Forbidden - You do not own this garage' });
      }
    })
    .catch(err => {
      console.error('Error checking garage ownership:', err);
      return res.status(500).json({ message: 'Internal server error' });
    });
};

module.exports = {
  authenticate,
  isAdmin,
  isAdminOrGarageOwner,
  isGarageOwner
}; 