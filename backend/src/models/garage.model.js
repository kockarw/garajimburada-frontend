module.exports = (sequelize, Sequelize) => {
  const Garage = sequelize.define('garages', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    ad_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    district: {
      type: Sequelize.STRING,
      allowNull: false
    },
    website: {
      type: Sequelize.STRING,
      allowNull: true
    },
    services: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: Sequelize.ENUM('approved', 'pending', 'rejected', 'inactive'),
      defaultValue: 'pending'
    },
    rejection_reason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    coordinates: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    create_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    update_time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  });

  // Add a method to calculate average rating based on reviews
  Garage.prototype.calculateRating = async function() {
    const { Review } = require('./index');
    const reviews = await Review.findAll({
      where: { garage_id: this.id }
    });

    if (reviews.length === 0) {
      return { rating: 0, reviewCount: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    return {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviews.length
    };
  };

  return Garage;
}; 