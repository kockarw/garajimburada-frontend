const { v4: uuidv4 } = require('uuid');
const { 
  Garage, 
  WorkingHours, 
  GalleryImage, 
  Review, 
  User,
  sequelize 
} = require('../models');
const { Op } = require('sequelize');

/**
 * Get all garages with optional filtering
 */
exports.getAllGarages = async (req, res) => {
  try {
    // Build query filters
    const filters = {};
    const {
      search,
      city,
      district,
      service,
      minRating,
      status,
      is_active
    } = req.query;

    // Search in name or description
    if (search) {
      filters[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by location
    if (city) filters.city = city;
    if (district) filters.district = district;

    // Filter by service - using array contains
    if (service) {
      filters.services = { [Op.contains]: [service] };
    }

    // Filter by status
    if (status) {
      filters.status = status;
    }

    // Filter by active status
    if (typeof is_active === 'boolean') {
      filters.is_active = is_active;
    }

    console.log('Applying filters:', filters); // Debug log

    // Get garages with relations
    const garages = await Garage.findAll({
      where: filters,
      include: [
        { 
          model: WorkingHours, 
          as: 'working_hours' 
        },
        { 
          model: GalleryImage, 
          as: 'gallery' 
        },
        { 
          model: User, 
          as: 'owner',
          attributes: ['id', 'username', 'email', 'avatar_url'] 
        }
      ],
      order: [['create_time', 'DESC']]
    });

    console.log('Found garages:', garages.map(g => ({ id: g.id, status: g.status, name: g.name }))); // Debug log

    // Filter by minimum rating after fetch (since rating is calculated)
    let result = garages;
    if (minRating) {
      const minRatingValue = parseFloat(minRating);
      result = [];
      
      for (const garage of garages) {
        const ratingInfo = await garage.calculateRating();
        garage.dataValues.rating = ratingInfo.rating;
        garage.dataValues.reviewCount = ratingInfo.reviewCount;
        
        if (ratingInfo.rating >= minRatingValue) {
          result.push(garage);
        }
      }
    } else {
      // Calculate ratings for all garages
      for (const garage of result) {
        const ratingInfo = await garage.calculateRating();
        garage.dataValues.rating = ratingInfo.rating;
        garage.dataValues.reviewCount = ratingInfo.reviewCount;
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching garages:', error);
    res.status(500).json({ 
      message: 'Failed to fetch garages',
      error: error.message
    });
  }
};

/**
 * Get garage by ID
 */
exports.getGarageById = async (req, res) => {
  try {
    console.log('Getting garage details for ID:', req.params.id);
    console.log('User from request:', req.user);
    
    const garage = await Garage.findByPk(req.params.id, {
      include: [
        { 
          model: WorkingHours, 
          as: 'working_hours' 
        },
        { 
          model: GalleryImage, 
          as: 'gallery',
          order: [['display_order', 'ASC']]
        },
        { 
          model: User, 
          as: 'owner',
          attributes: ['id', 'username', 'email', 'avatar_url'] 
        },
        {
          model: Review,
          as: 'reviews',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'avatar_url']
          }]
        }
      ]
    });

    if (!garage) {
      console.log('Garage not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Garage not found' });
    }

    // Check if user has access to view the garage
    const isPublicAccess = garage.is_active && garage.status === 'approved';
    const isAdmin = req.user?.role === 'admin';
    const isOwner = req.user?.id === garage.user_id;

    console.log('Access check:', {
      garageId: garage.id,
      garageUserId: garage.user_id,
      requestUserId: req.user?.id,
      isPublicAccess,
      isAdmin,
      isOwner
    });

    const userCanAccess = isPublicAccess || isAdmin || isOwner;

    if (!userCanAccess) {
      return res.status(403).json({ 
        message: 'You do not have permission to view this garage',
        details: {
          isOwner,
          isAdmin,
          isActiveAndApproved: isPublicAccess
        }
      });
    }
    
    // Calculate rating
    const ratingInfo = await garage.calculateRating();
    garage.dataValues.rating = ratingInfo.rating;
    garage.dataValues.reviewCount = ratingInfo.reviewCount;
    
    console.log('Successfully sending garage details');
    res.status(200).json(garage);
  } catch (error) {
    console.error('Error in getGarageById:', error);
    res.status(500).json({ 
      message: 'Failed to fetch garage details',
      error: error.message
    });
  }
};

/**
 * Create new garage
 */
exports.createGarage = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      city,
      district,
      website,
      services,
      image_url,
      working_hours,
      gallery,
      coordinates
    } = req.body;
    
    // Generate random ad_id (8 digits)
    const ad_id = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    // Create garage with initial status as 'pending'
    const garage = await Garage.create({
      id: uuidv4(),
      ad_id,
      user_id: req.user.id,
      name,
      description,
      address,
      phone,
      email,
      city,
      district,
      website,
      services: Array.isArray(services) ? services : [],
      image_url,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
      is_active: req.user.role === 'admin',
      coordinates
    }, { transaction });
    
    // Create working hours if provided
    if (working_hours) {
      await WorkingHours.create({
        id: uuidv4(),
        garage_id: garage.id,
        ...working_hours
      }, { transaction });
    }
    
    // Create gallery images if provided
    if (gallery && Array.isArray(gallery)) {
      for (let i = 0; i < gallery.length; i++) {
        await GalleryImage.create({
          id: uuidv4(),
          garage_id: garage.id,
          image_url: gallery[i].image_url,
          alt_text: gallery[i].alt_text || `${name} image ${i+1}`,
          display_order: i
        }, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Return created garage with relations
    const createdGarage = await Garage.findByPk(garage.id, {
      include: [
        { model: WorkingHours, as: 'working_hours' },
        { model: GalleryImage, as: 'gallery' }
      ]
    });
    
    res.status(201).json({
      message: 'Garage created successfully',
      garage: createdGarage
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating garage:', error);
    res.status(500).json({ 
      message: 'Failed to create garage',
      error: error.message
    });
  }
};

/**
 * Update garage
 */
exports.updateGarage = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const garageId = req.params.id;
    
    // Check if garage exists
    const garage = await Garage.findByPk(garageId);
    if (!garage) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Garage not found' });
    }
    
    // Check permissions - only admin or owner can update
    if (req.user.role !== 'admin' && garage.user_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: 'Forbidden - You do not own this garage' });
    }
    
    const {
      name,
      description,
      address,
      phone,
      email,
      city,
      district,
      website,
      services,
      image_url,
      working_hours,
      gallery,
      coordinates
    } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (city) updateData.city = city;
    if (district) updateData.district = district;
    if (website !== undefined) updateData.website = website;
    if (services) updateData.services = Array.isArray(services) ? services : [];
    if (image_url) updateData.image_url = image_url;
    if (coordinates) updateData.coordinates = coordinates;
    
    // Only admin can update verification status
    if (req.user.role === 'admin') {
      if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active;
      if (req.body.is_verified !== undefined) updateData.is_verified = req.body.is_verified;
    } else {
      // When a non-admin updates, set to not verified
      updateData.is_verified = false;
    }
    
    // Update garage
    await garage.update(updateData, { transaction });
    
    // Update working hours if provided
    if (working_hours) {
      const existingHours = await WorkingHours.findOne({ 
        where: { garage_id: garageId }
      });
      
      if (existingHours) {
        await existingHours.update(working_hours, { transaction });
      } else {
        await WorkingHours.create({
          id: uuidv4(),
          garage_id: garageId,
          ...working_hours
        }, { transaction });
      }
    }
    
    // Update gallery if provided
    if (gallery && Array.isArray(gallery)) {
      // Delete existing gallery images
      await GalleryImage.destroy({
        where: { garage_id: garageId },
        transaction
      });
      
      // Create new gallery images
      for (let i = 0; i < gallery.length; i++) {
        await GalleryImage.create({
          id: uuidv4(),
          garage_id: garageId,
          image_url: gallery[i].image_url,
          alt_text: gallery[i].alt_text || `${name || garage.name} image ${i+1}`,
          display_order: i
        }, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Return updated garage with relations
    const updatedGarage = await Garage.findByPk(garageId, {
      include: [
        { model: WorkingHours, as: 'working_hours' },
        { model: GalleryImage, as: 'gallery' }
      ]
    });
    
    res.status(200).json({
      message: 'Garage updated successfully',
      garage: updatedGarage
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating garage:', error);
    res.status(500).json({ 
      message: 'Failed to update garage',
      error: error.message
    });
  }
};

/**
 * Delete garage
 */
exports.deleteGarage = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const garageId = req.params.id;
    
    // Check if garage exists
    const garage = await Garage.findByPk(garageId);
    if (!garage) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Garage not found' });
    }
    
    // Check permissions - only admin or owner can delete
    if (req.user.role !== 'admin' && garage.user_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: 'Forbidden - You do not own this garage' });
    }
    
    // Delete related records
    await WorkingHours.destroy({
      where: { garage_id: garageId },
      transaction
    });
    
    await GalleryImage.destroy({
      where: { garage_id: garageId },
      transaction
    });
    
    await Review.destroy({
      where: { garage_id: garageId },
      transaction
    });
    
    // Delete garage
    await garage.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({ message: 'Garage deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting garage:', error);
    res.status(500).json({ 
      message: 'Failed to delete garage',
      error: error.message
    });
  }
};

/**
 * Toggle garage active status (admin only)
 */
exports.toggleGarageActive = async (req, res) => {
  try {
    const garageId = req.params.id;
    
    // Check if garage exists
    const garage = await Garage.findByPk(garageId);
    if (!garage) {
      return res.status(404).json({ message: 'Garage not found' });
    }
    
    // Toggle active status
    await garage.update({ is_active: !garage.is_active });
    
    res.status(200).json({
      message: `Garage ${garage.is_active ? 'activated' : 'deactivated'} successfully`,
      is_active: garage.is_active
    });
  } catch (error) {
    console.error('Error toggling garage active status:', error);
    res.status(500).json({ 
      message: 'Failed to toggle garage status',
      error: error.message
    });
  }
};

/**
 * Toggle garage verification status (admin only)
 */
exports.toggleGarageVerified = async (req, res) => {
  try {
    const garageId = req.params.id;
    
    // Check if garage exists
    const garage = await Garage.findByPk(garageId);
    if (!garage) {
      return res.status(404).json({ message: 'Garage not found' });
    }
    
    // Toggle verified status
    await garage.update({ is_verified: !garage.is_verified });
    
    res.status(200).json({
      message: `Garage ${garage.is_verified ? 'verified' : 'unverified'} successfully`,
      is_verified: garage.is_verified
    });
  } catch (error) {
    console.error('Error toggling garage verification status:', error);
    res.status(500).json({ 
      message: 'Failed to toggle garage verification',
      error: error.message
    });
  }
};

/**
 * Get user's garages with status filtering
 */
exports.getUserGarages = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    console.log('Getting garages for user:', { userId, requestedStatus: status }); // Debug log

    let whereClause = { user_id: userId };
    
    // Add status filter if provided and not 'all'
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    console.log('Using where clause:', whereClause); // Debug log

    const garages = await Garage.findAll({
      where: whereClause,
      include: [
        { 
          model: WorkingHours, 
          as: 'working_hours' 
        },
        { 
          model: GalleryImage, 
          as: 'gallery' 
        }
      ],
      order: [['create_time', 'DESC']]
    });

    console.log('Found garages:', garages.map(g => ({ id: g.id, status: g.status, name: g.name }))); // Debug log

    // Get counts for each status
    const statusCounts = {
      all: await Garage.count({ where: { user_id: userId } }),
      approved: await Garage.count({ 
        where: { 
          user_id: userId,
          status: 'approved'
        }
      }),
      pending: await Garage.count({ 
        where: { 
          user_id: userId,
          status: 'pending'
        }
      }),
      rejected: await Garage.count({ 
        where: { 
          user_id: userId,
          status: 'rejected'
        }
      }),
      inactive: await Garage.count({ 
        where: { 
          user_id: userId,
          status: 'inactive'
        }
      })
    };

    console.log('Status counts:', statusCounts); // Debug log

    res.status(200).json({
      garages,
      statusCounts
    });
  } catch (error) {
    console.error('Error getting user garages:', error);
    res.status(500).json({ 
      message: 'Failed to get user garages',
      error: error.message
    });
  }
};

/**
 * Update garage status
 */
exports.updateGarageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    console.log('Updating garage status:', { id, status, userId }); // Debug log

    // Check if garage exists and belongs to user
    const garage = await Garage.findOne({ 
      where: { 
        id,
        user_id: userId
      }
    });

    if (!garage) {
      return res.status(404).json({ message: 'Garage not found or unauthorized' });
    }

    // Update status directly
    await garage.update({
      status: status,
      is_active: status === 'approved',
      rejection_reason: status === 'rejected' ? (req.body.rejection_reason || 'Rejected by admin') : null
    });

    // Reload garage to get fresh data
    await garage.reload();

    console.log('Updated garage:', { 
      id: garage.id, 
      status: garage.status,
      is_active: garage.is_active
    }); // Debug log

    res.status(200).json({
      message: 'Garage status updated successfully',
      garage: garage
    });
  } catch (error) {
    console.error('Error updating garage status:', error);
    res.status(500).json({ 
      message: 'Failed to update garage status',
      error: error.message
    });
  }
};

/**
 * Debug endpoint to activate and verify a garage
 */
exports.debugActivateGarage = async (req, res) => {
  try {
    const garageId = req.params.id;
    
    // Find the garage
    const garage = await Garage.findByPk(garageId);
    if (!garage) {
      return res.status(404).json({ message: 'Garage not found' });
    }

    console.log('Current garage status:', {
      id: garage.id,
      is_active: garage.is_active,
      is_verified: garage.is_verified,
      status: garage.status
    });

    // Update garage status
    await garage.update({
      is_active: true,
      is_verified: true,
      status: 'approved'
    });

    console.log('Updated garage status:', {
      id: garage.id,
      is_active: garage.is_active,
      is_verified: garage.is_verified,
      status: garage.status
    });

    res.status(200).json({
      message: 'Garage activated and verified successfully',
      garage: {
        id: garage.id,
        is_active: garage.is_active,
        is_verified: garage.is_verified,
        status: garage.status
      }
    });
  } catch (error) {
    console.error('Error in debugActivateGarage:', error);
    res.status(500).json({ 
      message: 'Failed to activate garage',
      error: error.message
    });
  }
}; 