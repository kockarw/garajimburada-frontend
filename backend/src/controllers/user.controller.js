const bcrypt = require('bcryptjs');
const { User, Garage, Review } = require('../models');

/**
 * Get all users (admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * Update user profile
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check permissions - only admin or the user themselves can update
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden - You can only update your own profile' });
    }
    
    const { username, email, password, avatar_url } = req.body;
    
    // Build update object
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar_url) updateData.avatar_url = avatar_url;
    
    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Only admin can update role
    if (req.body.role && req.user.role === 'admin') {
      updateData.role = req.body.role;
    }
    
    // Update user
    await user.update(updateData);
    
    // Return updated user (without password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      message: 'Failed to update user',
      error: error.message
    });
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check permissions - only admin or the user themselves can delete
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden - You can only delete your own account' });
    }
    
    // Delete user (and associated records)
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

/**
 * Get user's garages
 */
exports.getUserGarages = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's garages
    const garages = await Garage.findAll({
      where: { user_id: userId },
      include: ['working_hours', 'gallery']
    });
    
    res.status(200).json(garages);
  } catch (error) {
    console.error('Error fetching user garages:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user garages',
      error: error.message
    });
  }
};

/**
 * Get user's reviews
 */
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's reviews
    const reviews = await Review.findAll({
      where: { user_id: userId },
      include: [{
        model: Garage,
        as: 'garage',
        attributes: ['id', 'name', 'image_url']
      }]
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
}; 