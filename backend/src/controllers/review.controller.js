const { v4: uuidv4 } = require('uuid');
const { Review, Garage, User } = require('../models');

/**
 * Get all reviews for a garage
 */
exports.getGarageReviews = async (req, res) => {
  try {
    const garageId = req.params.garageId;
    
    // Check if garage exists
    const garage = await Garage.findByPk(garageId);
    if (!garage) {
      return res.status(404).json({ message: 'Garage not found' });
    }
    
    // Get reviews
    const reviews = await Review.findAll({
      where: { garage_id: garageId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar_url']
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching garage reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Create new review
 */
exports.createReview = async (req, res) => {
  try {
    const garageId = req.params.garageId;
    const userId = req.user.id;
    const { rating, comment } = req.body;
    
    // Check if garage exists and is active/verified
    const garage = await Garage.findOne({
      where: {
        id: garageId,
        is_active: true,
        is_verified: true
      }
    });
    
    if (!garage) {
      return res.status(404).json({ message: 'Garage not found or not available for reviews' });
    }
    
    // Check if user already reviewed this garage
    const existingReview = await Review.findOne({
      where: {
        garage_id: garageId,
        user_id: userId
      }
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this garage' });
    }
    
    // Create review
    const review = await Review.create({
      id: uuidv4(),
      garage_id: garageId,
      user_id: userId,
      rating: parseFloat(rating),
      comment,
      is_verified: true // Default to verified, can be changed by admin
    });
    
    // Get review with user info
    const createdReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar_url']
      }]
    });
    
    res.status(201).json({
      message: 'Review created successfully',
      review: createdReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      message: 'Failed to create review',
      error: error.message
    });
  }
};

/**
 * Update review
 */
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;
    
    // Check if review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check permissions - only admin or the author can update
    if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden - You cannot update this review' });
    }
    
    // Update review
    await review.update({
      rating: rating ? parseFloat(rating) : review.rating,
      comment: comment || review.comment,
      // If admin, they can set verified status
      is_verified: req.user.role === 'admin' ? 
        (req.body.is_verified !== undefined ? req.body.is_verified : review.is_verified) : 
        review.is_verified
    });
    
    // Get updated review with user info
    const updatedReview = await Review.findByPk(reviewId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar_url']
      }]
    });
    
    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Failed to update review',
      error: error.message
    });
  }
};

/**
 * Delete review
 */
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    // Check if review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check permissions - only admin or the author can delete
    if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden - You cannot delete this review' });
    }
    
    // Delete review
    await review.destroy();
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

/**
 * Toggle review verification status (admin only)
 */
exports.toggleReviewVerified = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    // Check if review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Toggle verified status
    await review.update({ is_verified: !review.is_verified });
    
    res.status(200).json({
      message: `Review ${review.is_verified ? 'verified' : 'unverified'} successfully`,
      is_verified: review.is_verified
    });
  } catch (error) {
    console.error('Error toggling review verification status:', error);
    res.status(500).json({ 
      message: 'Failed to toggle review verification',
      error: error.message
    });
  }
}; 