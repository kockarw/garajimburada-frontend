const { sequelize, Sequelize } = require('../config/sequelize');

// Import models
const Garage = require('./garage.model')(sequelize, Sequelize);
const User = require('./user.model')(sequelize, Sequelize);
const WorkingHours = require('./workingHours.model')(sequelize, Sequelize);
const GalleryImage = require('./galleryImage.model')(sequelize, Sequelize);
const Review = require('./review.model')(sequelize, Sequelize);
const Appointment = require('./appointment.model')(sequelize, Sequelize);

// Define associations
Garage.belongsTo(User, { as: 'owner', foreignKey: 'user_id' });
User.hasMany(Garage, { as: 'garages', foreignKey: 'user_id' });

Garage.hasOne(WorkingHours, { as: 'working_hours', foreignKey: 'garage_id' });
WorkingHours.belongsTo(Garage, { foreignKey: 'garage_id' });

Garage.hasMany(GalleryImage, { as: 'gallery', foreignKey: 'garage_id' });
GalleryImage.belongsTo(Garage, { foreignKey: 'garage_id' });

Garage.hasMany(Review, { as: 'reviews', foreignKey: 'garage_id' });
Review.belongsTo(Garage, { foreignKey: 'garage_id' });

User.hasMany(Review, { as: 'reviews', foreignKey: 'user_id' });
Review.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

// Garage - Appointment relationship (one-to-many)
Garage.hasMany(Appointment, { as: 'appointments', foreignKey: 'garage_id' });
Appointment.belongsTo(Garage, { as: 'garage', foreignKey: 'garage_id' });

// User - Appointment relationship (one-to-many)
User.hasMany(Appointment, { as: 'appointments', foreignKey: 'user_id' });
Appointment.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize,
  Garage,
  User,
  WorkingHours,
  GalleryImage,
  Review,
  Appointment
}; 