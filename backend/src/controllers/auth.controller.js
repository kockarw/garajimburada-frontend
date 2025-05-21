const bcrypt = require('bcryptjs');
const { User, Sequelize } = require('../models');
const { Op } = Sequelize;
const { generateToken } = require('../utils/jwt.utils');
const { v4: uuidv4 } = require('uuid');

/**
 * Format phone number to standard format
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all spaces and non-numeric characters
  let cleaned = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
  
  // If the number starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // If the number starts with 90, remove it
  if (cleaned.startsWith('90')) {
    cleaned = cleaned.substring(2);
  }
  
  // Add +90 prefix
  return `+90${cleaned}`;
};

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Registration failed', 
        errors: {
          user: 'Username, email, and password are required'
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Registration failed', 
        errors: {
          user: 'Username or email already exists'
        }
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Create user
    const user = await User.create({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role: 'user',
      phone: formattedPhone // Use formatted phone number
    });

    // Generate JWT token
    const token = generateToken(user);

    // Return user info and token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin,
        avatar_url: user.avatar_url,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        message: 'Login failed', 
        errors: {
          email: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Login failed', 
        errors: {
          password: 'Invalid email or password'
        }
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user info and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin,
        avatar_url: user.avatar_url,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Get current user info
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User is attached to req by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        is_admin: req.user.is_admin,
        avatar_url: req.user.avatar_url,
        phone: req.user.phone
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      message: 'Failed to get user info',
      error: error.message
    });
  }
}; 