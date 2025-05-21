module.exports = (sequelize, Sequelize) => {
  const GalleryImage = sequelize.define('gallery_images', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    garage_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'garages',
        key: 'id'
      }
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    alt_text: {
      type: Sequelize.STRING,
      allowNull: true
    },
    display_order: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return GalleryImage;
}; 